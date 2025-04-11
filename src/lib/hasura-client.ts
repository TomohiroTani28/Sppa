// src/lib/hasura-client.ts
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import type { DocumentNode } from "graphql";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

// クライアント作成関数を定義
export const createHasuraClient = async (headers: Record<string, string> = {}) => {
  const session = await getSession();
  const nextAuthToken = session?.access_token ?? "";
  const adminSecret = process.env['NEXT_PUBLIC_HASURA_ADMIN_SECRET'] ?? "";

  const httpLink = new HttpLink({
    uri: process.env['NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT'] ?? "http://localhost:8081/v1/graphql",
    headers: {
      Authorization: nextAuthToken ? `Bearer ${nextAuthToken}` : "",
      "x-hasura-admin-secret": adminSecret,
      ...headers,
    },
  });

  const wsClient = createClient({
    url: process.env['NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT'] ?? "ws://localhost:8081/v1/graphql",
    connectionParams: async () => {
      const session = await getSession();
      const token = session?.access_token ?? "";
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "x-hasura-admin-secret": adminSecret,
          ...headers,
        },
      };
    },
    retryAttempts: 3,
    retryWait: async (retries: number) => {
      const delay = Math.min(1000 * Math.pow(2, retries), 8000);
      await new Promise(resolve => setTimeout(resolve, delay));
    },
    on: {
      connected: () => console.log("[WebSocket] Connected"),
      closed: () => console.log("[WebSocket] Closed"),
      error: (error: unknown) => {
        if (error instanceof Error) {
          console.error("[WebSocket] Error:", error);
        } else {
          console.error("[WebSocket] Error:", String(error));
        }
      },
    },
    keepAlive: 10000,
    lazy: true,
    connectionAckWaitTimeout: 10000,
  });

  const wsLink = new GraphQLWsLink(wsClient);

  const splitLink = split(
    ({ query }: { query: DocumentNode }) => {
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

// 1. 非同期でクライアントを取得する関数 - 既存の実装との後方互換性を確保
export async function getClient() {
  return createHasuraClient();
}

// 2. 古いコードとの互換性のためのエイリアス
export const getGraphqlClient = getClient;

// 3. デフォルトエクスポートとして関数を提供
export default getClient;

// 4. graphqlClient という名前で呼び出し可能な関数をエクスポート
export const graphqlClient = getClient;