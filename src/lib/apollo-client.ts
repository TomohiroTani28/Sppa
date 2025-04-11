import { ApolloClient, InMemoryCache, createHttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { getSession } from "next-auth/react";

// HTTP Link for queries and mutations
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ?? "http://localhost:8081/v1/graphql",
});

// Function to get the JWT token from the session (Client-side)
// Ensure your NextAuth session callback includes the JWT token ('access_token')
const getAuthHeaders = async () => {
  const session = await getSession();
  const token = session?.access_token; // Changed from accessToken to access_token
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

// WebSocket Link for subscriptions
// Use a function for connectionParams to potentially refresh token on reconnect
const wsLink = new GraphQLWsLink(createClient({
  url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT ?? "ws://localhost:8081/v1/graphql",
  connectionParams: async () => { // Changed to call getAuthHeaders
    const headers = await getAuthHeaders();
    return { headers };
  },
  // Keep existing retry logic
  retryAttempts: 3,
  retryWait: async (retries) => {
    await new Promise(resolve => setTimeout(resolve, Math.min(1000 * retries, 5000)));
  },
}));

// Auth Link for HTTP requests
const authLink = setContext(async (_, { headers }) => { // Changed to call getAuthHeaders
  const authHeaders = await getAuthHeaders();
  return {
    headers: {
      ...headers,
      ...authHeaders,
    },
  };
});

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink) // Use authLink for HTTP requests
);

// Create the Apollo Client instance directly (not async)
const apolloClientInstance = new ApolloClient({ // Changed: Create instance directly
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache", // Consider 'cache-and-network' or 'network-only' based on needs
    },
    query: {
      fetchPolicy: "no-cache", // Consider 'cache-and-network' or 'network-only' based on needs
    },
    // Add default options for mutations if needed
  },
});

// Export the instance directly
export const graphqlClient = apolloClientInstance; // Changed: Export instance

// Helper function to get the client (useful if initialization needs to be async in the future)
export const getGraphqlClient = () => { // Added helper function
  return apolloClientInstance;
}; 