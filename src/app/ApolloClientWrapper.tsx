// src/app/ApolloClientWrapper.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@/hooks/api/useAuth";
import { createWsClient } from "@/lib/create-ws-client";

const httpEndpoint =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ?? "http://localhost:8081/v1/graphql";
const wsEndpoint =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT ?? "ws://localhost:8081/v1/graphql";

interface ApolloClientWrapperProps {
  readonly children: React.ReactNode;
}

export default function ApolloClientWrapper({ children }: ApolloClientWrapperProps) {
  const { user, token, loading: authLoading } = useAuth();
  const [client, setClient] = useState<ApolloClient<any> | null>(null);
  const [wsConnectionFailed, setWsConnectionFailed] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const clientInitialized = useRef(false);

  useEffect(() => {
    if (authLoading) {
      console.log("Waiting for authentication...");
      return;
    }

    if (user && token && !clientInitialized.current) {
      const effectiveRole = (user as any)?.role ?? "tourist";
      const newClient = createApolloClient(
        token,
        effectiveRole,
        user.id,
        setWsConnectionFailed
      );
      setClient(newClient);
      clientInitialized.current = true;
    } else if (!token) {
      setTokenError("Failed to fetch JWT token.");
    }
  }, [user, token, authLoading]);

  if (authLoading || !client) {
    return <div>Loading authentication and Apollo Client...</div>;
  }

  return (
    <ApolloProvider client={client}>
      {wsConnectionFailed && (
        <div
          className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">WebSocket Connection Failed</p>
          <p>Real-time updates are unavailable. Please ensure the GraphQL server is running.</p>
        </div>
      )}
      {tokenError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">Authentication Error</p>
          <p>{tokenError}</p>
        </div>
      )}
      {children}
    </ApolloProvider>
  );
}

function createApolloClient(
  token: string,
  role: string,
  userId?: string,
  setWsConnectionFailed?: React.Dispatch<React.SetStateAction<boolean>>
): ApolloClient<any> {
  console.log("GraphQL Endpoints:", { http: httpEndpoint, ws: wsEndpoint });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.error(
        "GraphQL Errors:",
        graphQLErrors.map((e) => ({
          message: e.message,
          path: e.path,
          extensions: e.extensions,
        }))
      );
    }
    if (networkError) {
      console.error("Network Error:", networkError.message);
    }
  });

  const authLink = setContext((_, { headers = {} }) => {
    const authHeaders = {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    return { headers: authHeaders };
  });

  const httpLink = new HttpLink({ uri: httpEndpoint });
  let wsLink: GraphQLWsLink | null = null;

  if (typeof window !== "undefined") {
    try {
      const wsClient = createWsClient(token);
      if (wsClient) {
        wsLink = new GraphQLWsLink(wsClient);
      } else {
        throw new Error("Failed to create WebSocket client");
      }
    } catch (e) {
      console.error("Failed to create WebSocket client:", {
        error: e instanceof Error ? e.message : String(e),
        timestamp: new Date().toISOString(),
      });
      if (setWsConnectionFailed) setWsConnectionFailed(true);
      wsLink = null;
    }
  }

  const splitLink = wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        authLink.concat(httpLink)
      )
    : authLink.concat(httpLink);

  const enhancedLink = ApolloLink.from([errorLink, splitLink]);

  return new ApolloClient({
    link: enhancedLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: "network-only", errorPolicy: "all" },
      mutate: { fetchPolicy: "network-only", errorPolicy: "all" },
      watchQuery: { fetchPolicy: "network-only", errorPolicy: "all" },
    },
    connectToDevTools: true,
  });
}