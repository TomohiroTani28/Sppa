// src/hooks/useRealTimeAvailability.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// エンドポイントは環境変数から取得（未設定時はローカルのフォールバック）
const httpEndpoint =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ||
  "http://localhost:8081/v1/graphql";
const wsEndpoint =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT ||
  "ws://localhost:8081/v1/graphql";

export default function createSubscriptionClient(token?: string) {
  const httpLink = new HttpLink({
    uri: httpEndpoint,
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: wsEndpoint,
      connectionParams: {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // "x-hasura-role": token ? "therapist" : "tourist", // 削除
          // ...(token ? {} : { "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET }), // 削除
        },
      },
      // 必要に応じてその他のオプションも追加可能
    })
  );

  const link = split(
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
    link,
    cache: new InMemoryCache(),
  });
}