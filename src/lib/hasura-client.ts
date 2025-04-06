// src/lib/hasura-client.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

export const createHasuraClient = async (headers: Record<string, string> = {}) => {
  const session = await getSession();
  const nextAuthToken = session?.access_token ?? "";
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

export default async function getDefaultClient() {
  return createHasuraClient();
}