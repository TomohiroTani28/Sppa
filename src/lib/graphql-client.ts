import logger from '@/lib/logger';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

// シングルトンインスタンス
let apolloClient: ApolloClient<NormalizedCacheObject>;

// エラーログリンク
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      logger.error(`[GraphQL error]: ${message}`, {
        context: 'GraphQL',
        data: {
          locations,
          path,
          extensions,
          operationName: operation.operationName,
        }
      });
    });
  }

  if (networkError) {
    logger.error(`[Network error]: ${networkError.message}`, {
      context: 'GraphQL',
      data: {
        operation: operation.operationName,
        variables: operation.variables,
      }
    });
  }

  return forward(operation);
});

// 非同期クライアント取得関数（既存コードの互換性維持）
export async function getClient() {
  return initApolloClient();
}

// クライアント初期化関数
export function initApolloClient() {
  // SSRの場合は毎回新しいクライアントを作成
  if (typeof window === "undefined") {
    return createApolloClient();
  }
  
  // クライアントサイドではシングルトンを再利用
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  
  return apolloClient;
}

// ApolloClient作成関数
function createHttpLink() {
  const endpoint = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT || "http://localhost:8080/v1/graphql";
  return new HttpLink({
    uri: endpoint,
    credentials: "include",
  });
}

function createWsLink() {
  if (typeof window === "undefined") {
    return null;
  }
  
  const wsEndpoint = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT ?? "ws://localhost:8080/v1/graphql";
  return new GraphQLWsLink(
    createClient({
      url: wsEndpoint,
      connectionParams: async () => {
        try {
          const session = await getSession();
          const token = session?.access_token;
          
          return token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};
        } catch (error) {
          console.error("Error getting WebSocket auth:", error);
          return {};
        }
      },
      retryAttempts: 3,
      retryWait: async (retries) => {
        const delay = Math.min(1000 * Math.pow(2, retries), 8000);
        await new Promise(resolve => setTimeout(resolve, delay));
      },
      on: {
        connected: () => logger.info("[WebSocket] Connected", { context: 'WebSocket' }),
        closed: () => logger.info("[WebSocket] Closed", { context: 'WebSocket' }),
        error: (err) => logger.error("[WebSocket] Error", { context: 'WebSocket', data: { error: err } }),
      },
    })
  );
}

// 分割リンク作成関数
function createSplitLink(
  httpLink: HttpLink, 
  wsLink: GraphQLWsLink | null
) {
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink || httpLink,
    httpLink
  );
}

// ApolloClient作成関数
function createApolloClient() {
  const httpLink = createHttpLink();
  const wsLink = createWsLink();
  const splitLink = createSplitLink(httpLink, wsLink);
  
  return new ApolloClient({
    link: errorLink.concat(splitLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "all",
      },
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
}

// グローバルクライアントインスタンス
export const graphqlClient = initApolloClient();

// クライアント取得関数
export const getGraphqlClient = () => graphqlClient;
export default getClient; 