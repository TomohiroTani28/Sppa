// src/lib/hasura-client.ts
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  NormalizedCacheObject,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";

const isBuildPhase =
  process.env.NODE_ENV === "production" && typeof window === "undefined";

const HASURA_HTTP_ENDPOINT =
  isBuildPhase
    ? ""
    : process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT || "http://localhost:8081/v1/graphql";
const HASURA_WS_ENDPOINT =
  isBuildPhase
    ? ""
    : process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT || "ws://localhost:8081/v1/graphql";
// クライアント側では管理者シークレットを使用しない
const HASURA_ADMIN_SECRET = "";

const authMiddleware = (token?: string) =>
  setContext((_, { headers = {} }) => {
    const role = token ? "therapist" : "tourist";
    const newHeaders = {
      ...headers,
      "Content-Type": "application/json",
      "x-hasura-role": role,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // 管理者シークレットはクライアント側では使用しません
    };
    return { headers: newHeaders };
  });

const httpLink = new HttpLink({ uri: HASURA_HTTP_ENDPOINT });

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]:`, JSON.stringify(networkError, null, 2));
  }
});

export const createHasuraClient = (token?: string) => {
  if (isBuildPhase) {
    return new ApolloClient({
      cache: new InMemoryCache(),
    });
  }

  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          createClient({
            url: HASURA_WS_ENDPOINT,
            connectionParams: () => {
              const headers = {
                "Content-Type": "application/json",
                "x-hasura-role": token ? "therapist" : "tourist",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              };
              console.log("GraphQLWsLink connectionParams:", headers);
              return { headers };
            },
            shouldRetry: () => true,
          })
        )
      : null;

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
        httpLink
      )
    : httpLink;

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authMiddleware(token), splitLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: "no-cache" },
      mutate: { fetchPolicy: "no-cache" },
    },
  });
};

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

export function initializeApollo(
  initialState: Record<string, any> | null = null,
  token?: string
) {
  const _apolloClient = apolloClient ?? createHasuraClient(token);

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({
      ...existingCache,
      ...(initialState && typeof initialState === "object" ? initialState : {}),
    });
  }
  if (typeof window === "undefined") return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export const graphqlClient = initializeApollo(null);
export default graphqlClient;
