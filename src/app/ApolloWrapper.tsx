// src/app/ApolloWrapper.tsx
"use client";
import React, { useState, useEffect } from "react";
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
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@/app/hooks/api/useAuth";

const httpEndpoint =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ??
  "http://localhost:8081/v1/graphql";
const wsEndpoint =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT ??
  "wss://localhost:8081/v1/graphql";
const adminSecret =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET ?? "";

type ApolloWrapperProps = {
  readonly children: React.ReactNode;
};

export function ApolloWrapper({ children }: ApolloWrapperProps) {
  const { role, token, user, loading: authLoading } = useAuth();
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    if (authLoading) {
      logWaitingAuth(role);
      return;
    }

    const { effectiveRole, effectiveToken } = getEffectiveCredentials(role, token);
    logAuthComplete(effectiveRole, effectiveToken);
    const newClient = createApolloClient(effectiveToken, effectiveRole, user?.id);
    updateClient(newClient, setClient);
  }, [role, token, user, authLoading]);

  if (authLoading || !client) {
    return <div>認証と Apollo Client をロード中...</div>;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

function logWaitingAuth(role: string | undefined) {
  console.log(
    "認証待機中: { role: '%s', token: 'undefined', authLoading: true }",
    role ?? "tourist"
  );
}

function getEffectiveCredentials(role: string | undefined, token: string | undefined) {
  const effectiveRole = role ?? "tourist";
  const effectiveToken = token ?? "";
  return { effectiveRole, effectiveToken };
}

function logAuthComplete(effectiveRole: string, effectiveToken: string) {
  console.log(
    "認証完了: { role: '%s', token: '%s', authLoading: false }",
    effectiveRole,
    effectiveToken ? effectiveToken.substring(0, 20) + "..." : "undefined"
  );
  console.log("Apollo Client を初期化:", {
    role: effectiveRole,
    token: effectiveToken ? "exists" : "undefined",
  });
}

function updateClient(
  newClient: ApolloClient<any>,
  setClient: React.Dispatch<React.SetStateAction<ApolloClient<any> | null>>
) {
  setClient((prevClient) => {
    if (!prevClient) return newClient;
    prevClient.setLink(newClient.link);
    return prevClient;
  });
}

function createApolloClient(token: string, role: string, userId?: string) {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.error(
        "GraphQL エラー:",
        graphQLErrors.map((e) => ({
          message: e.message,
          path: e.path,
          extensions: e.extensions,
        }))
      );
    }
    if (networkError) {
      console.error("ネットワークエラー:", networkError.message);
    }
  });

  const authLink = setContext((_, { headers }) => {
    const authHeaders = {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "x-hasura-role": role,
      ...(userId ? { "x-hasura-user-id": userId } : {}),
      ...(adminSecret ? { "x-hasura-admin-secret": adminSecret } : {}),
    };
    console.log("リクエストヘッダー:", {
      "x-hasura-role": authHeaders["x-hasura-role"],
      Authorization: authHeaders.Authorization ? "exists" : "none",
      "x-hasura-user-id": authHeaders["x-hasura-user-id"] ?? "none",
      "x-hasura-admin-secret": authHeaders["x-hasura-admin-secret"] ? "exists" : "none",
    });
    return { headers: authHeaders };
  });

  const httpLink = new HttpLink({ uri: httpEndpoint });

  const wsLink =
    typeof window !== "undefined" && wsEndpoint
      ? new GraphQLWsLink(
          createClient({
            url: wsEndpoint,
            connectionParams: () => {
              const params = {
                headers: {
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  "x-hasura-role": role,
                  ...(userId ? { "x-hasura-user-id": userId } : {}),
                  ...(adminSecret ? { "x-hasura-admin-secret": adminSecret } : {}),
                },
              };
              console.log("WebSocket 接続パラメータ:", params.headers);
              return params;
            },
            shouldRetry: () => true,
          })
        )
      : null;

  const link = wsLink
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

  return new ApolloClient({
    link: ApolloLink.from([errorLink, link]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: "network-only" },
      mutate: { fetchPolicy: "network-only" },
    },
    connectToDevTools: true,
  });
}

export default ApolloWrapper;
