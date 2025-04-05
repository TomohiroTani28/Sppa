// src/lib/hasura-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getSession } from "next-auth/react";

export const createHasuraClient = async (headers: Record<string, string> = {}) => {
  const session = await getSession();
  const token = session?.access_token ?? "";

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ?? "http://localhost:8081/v1/graphql",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...headers,
    },
  });

  const wsLink = new WebSocketLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT ?? "ws://localhost:8081/v1/graphql",
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
          ...headers,
        },
      },
    },
  });

  return new ApolloClient({
    link: typeof window === "undefined" ? httpLink : wsLink,
    cache: new InMemoryCache(),
  });
};

// デフォルトクライアントは非同期で生成
export default async function getDefaultClient() {
  return createHasuraClient();
}