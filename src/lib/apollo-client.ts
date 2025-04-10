import { ApolloClient, InMemoryCache, createHttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { getSession } from "next-auth/react";

// HTTP Link for queries and mutations
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:8080/v1/graphql",
});

// WebSocket Link for subscriptions
const wsLink = new GraphQLWsLink(createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL ?? "ws://localhost:8080/v1/graphql",
  connectionParams: async () => {
    const session = await getSession();
    const token = session?.user?.id; // または適切なトークンフィールド
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  },
}));

// Auth Link for HTTP requests
const authLink = setContext(async (_, { headers }) => {
  const session = await getSession();
  const token = session?.user?.id; // または適切なトークンフィールド
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
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
  authLink.concat(httpLink)
);

export const graphqlClient = async () => {
  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
      },
      query: {
        fetchPolicy: "no-cache",
      },
    },
  });
}; 