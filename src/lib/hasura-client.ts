// src/lib/hasura-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Hasuraクライアントを生成する関数
export const createHasuraClient = (token: string, headers: Record<string, string>) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.HASURA_GRAPHQL_URL || "http://localhost:8081/v1/graphql",
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    }),
    cache: new InMemoryCache(),
  });
};