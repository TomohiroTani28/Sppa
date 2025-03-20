// src/app/(common)/search/hooks/useRealTimeAvailability.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpEndpoint =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ||
  "http://localhost:8081/v1/graphql";
const wsEndpoint =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT ||
  "wss://localhost:8081/v1/graphql";

export default function createSubscriptionClient(token?: string) {
  const httpLink = new HttpLink({
    uri: httpEndpoint,
  });

  const wsLink = new WebSocketLink({
    uri: wsEndpoint,
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {
                "x-hasura-admin-secret":
                  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET,
              }),
          "x-hasura-role": token ? "therapist" : "anonymous",
        },
      },
    },
  });

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