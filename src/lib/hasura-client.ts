// src/lib/hasura-client.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getSession } from "next-auth/react";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

export const createHasuraClient = async (headers: Record<string, string> = {}) => {
  const session = await getSession();
  const nextAuthToken = session?.access_token ?? "";

  // Hasura が管理者用の認証ヘッダーを要求する場合、環境変数からシークレットを取得
  const adminSecret = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET ?? "";

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ?? "http://localhost:8081/v1/graphql",
    headers: {
      Authorization: nextAuthToken ? `Bearer ${nextAuthToken}` : "",
      "x-hasura-admin-secret": adminSecret,
      ...headers,
    },
  });

  const wsClient = createClient({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT ?? "ws://localhost:8081/v1/graphql",
    connectionParams: async () => {
      const jwtResponse = await fetch("/api/auth/get-jwt");
      const jwtData = await jwtResponse.json();
      const hasuraToken = jwtData?.token;

      return {
        headers: {
          "Content-Type": "application/json",
          Authorization: hasuraToken ? `Bearer ${hasuraToken}` : "",
          "x-hasura-admin-secret": adminSecret,
          ...headers,
        },
      };
    },
  });

  const wsLink = new GraphQLWsLink(wsClient);

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
};

// デフォルトクライアントは非同期で生成
export default async function getDefaultClient() {
  return createHasuraClient();
}
