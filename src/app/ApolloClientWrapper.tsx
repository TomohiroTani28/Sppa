// src/app/ApolloClientWrapper.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
  NormalizedCacheObject
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@/hooks/api/useAuth";
import { createWsClient } from "@/lib/create-ws-client";

// 認証状態の型を定義
interface AuthState {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role?: string } | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

// ApolloClientインスタンスの型を定義
interface ApolloClientInstance {
  client: ApolloClient<NormalizedCacheObject>;
  token: string;
}

// 環境変数を一度だけ読み込む
const httpEndpoint =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ??
  "http://localhost:8081/v1/graphql";

interface ApolloClientWrapperProps {
  readonly children: React.ReactNode;
}

// ApolloClientインスタンスをグローバルに保持（型を明示）
let globalApolloClient: ApolloClientInstance | null = null;

export default function ApolloClientWrapper({
  children,
}: ApolloClientWrapperProps) {
  const { getAuthState } = useAuth();
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  // 使用しない状態は、コメントアウトするか削除します
  // const [wsConnectionFailed, setWsConnectionFailed] = useState(false);

  // 認証状態を非同期で取得
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const state = await getAuthState();
        setAuthState(state);
      } catch (error) {
        console.error("Failed to fetch auth state:", error);
        setAuthState(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    fetchAuthState();
  }, [getAuthState]);

  // Apolloクライアントをメモ化して不要な再生成を防ぐ
  const client = useMemo(() => {
    if (isLoadingAuth || !authState) return null;

    const token = authState.token;
    const user = authState.user;
    if (!token || !user) return null;

    const effectiveRole = user.role ?? "tourist"; // || から ?? に変更
    
    // 既存のクライアントがあれば再利用（トークンが同じ場合）
    if (globalApolloClient && globalApolloClient.token === token) {
      return globalApolloClient.client;
    }
    
    // 新しいクライアントを作成
    const newClient = createApolloClient(token, effectiveRole);
    
    // グローバル変数に保存
    globalApolloClient = {
      client: newClient,
      token
    };
    
    return newClient;
  }, [authState, isLoadingAuth]);

  // 認証状態のローディング中
  if (isLoadingAuth) {
    return <div>Loading authentication...</div>;
  }

  // 未認証時もchildrenを表示
  if (!client) {
    return <>{children}</>;
  }

  return (
    <ApolloProvider client={client}>
      {/* wsConnectionFailedは使用していないため、この部分も削除またはコメントアウト
      {wsConnectionFailed && (
        <div
          className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">WebSocket Connection Failed</p>
          <p>
            Real-time updates are unavailable. Please ensure the GraphQL server
            is running.
          </p>
        </div>
      )}
      */}
      {children}
    </ApolloProvider>
  );
}

// この関数はコンポーネントの外側に配置し、不要な再生成を避ける
function createApolloClient(token: string, role: string): ApolloClient<NormalizedCacheObject> {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.error(
        "GraphQL Errors:",
        graphQLErrors.map((e) => ({
          message: e.message,
          path: e.path,
          extensions: e.extensions,
        }))
      );
    }
    if (networkError) {
      console.error("Network Error:", networkError.message);
    }
  });

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }));

  const httpLink = new HttpLink({ uri: httpEndpoint });

  let wsLink: ApolloLink | null = null;

  if (typeof window !== "undefined" && token) {
    try {
      // 修正したcreateWsClient関数を使用
      const wsClient = createWsClient(token);
      wsLink = wsClient ? new GraphQLWsLink(wsClient) : null;
    } catch (error) {
      console.error("WebSocket setup failed");
      wsLink = null;
    }
  }

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
        authLink.concat(httpLink)
      )
    : authLink.concat(httpLink);

  return new ApolloClient({
    link: ApolloLink.from([errorLink, splitLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: "network-only", errorPolicy: "all" },
      mutate: { fetchPolicy: "network-only", errorPolicy: "all" },
      watchQuery: { fetchPolicy: "network-only", errorPolicy: "all" },
    },
    connectToDevTools: process.env.NODE_ENV === 'development',
  });
}