// src/app/ApolloWrapper.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@/app/hooks/api/useAuth";

// エンドポイント（環境変数未設定時のフォールバック）
const httpEndpoint =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ?? "http://localhost:8081/v1/graphql";
const wsEndpoint =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT ?? "ws://localhost:8081/v1/graphql";
// ※ クライアント側では管理者シークレットは利用しない（セキュリティ上の理由）
const adminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET ?? "";

type ApolloWrapperProps = {
  children: React.ReactNode;
};

export function ApolloWrapper({ children }: ApolloWrapperProps) {
  const { role, token, user, loading: authLoading } = useAuth();
  const [client, setClient] = useState<ApolloClient<any> | null>(null);
  const [wsConnectionFailed, setWsConnectionFailed] = useState(false);
  const clientInitialized = useRef(false);

  useEffect(() => {
    if (authLoading) {
      console.log("認証待機中:", { role: role ?? "tourist", token: "undefined", authLoading: true });
      return;
    }
    const { effectiveRole, effectiveToken } = getEffectiveCredentials(role, token);
    console.log("認証完了:", {
      role: effectiveRole,
      token: effectiveToken ? effectiveToken.substring(0, 20) + "..." : "undefined",
      authLoading: false,
    });
    // クライアント生成（認証情報の変更時のみ新規作成）
    const newClient = createApolloClient(
      effectiveToken,
      effectiveRole,
      user?.id,
      setWsConnectionFailed
    );
    updateClient(newClient, setClient);
    clientInitialized.current = true;
  }, [role, token, user, authLoading]);

  if (authLoading || !client) {
    return <div>認証と Apollo Client をロード中...</div>;
  }

  return (
    <ApolloProvider client={client}>
      {wsConnectionFailed && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4" role="alert">
          <p className="font-bold">WebSocket 接続が失敗しました</p>
          <p>リアルタイム更新が利用できません。GraphQL サーバーが起動しているか確認してください。</p>
        </div>
      )}
      {children}
    </ApolloProvider>
  );
}

function getEffectiveCredentials(role: string | undefined, token: string | undefined) {
  const effectiveRole = role ?? "tourist";
  const effectiveToken = token ?? "";
  return { effectiveRole, effectiveToken };
}

function updateClient(
  newClient: ApolloClient<any>,
  setClient: React.Dispatch<React.SetStateAction<ApolloClient<any> | null>>
) {
  setClient((prevClient) => {
    if (!prevClient) return newClient;
    // クライアントのリンクのみ更新（不要な再生成を防ぐ）
    prevClient.setLink(newClient.link);
    return prevClient;
  });
}

function createApolloClient(
  token: string,
  role: string,
  userId?: string,
  setWsConnectionFailed?: React.Dispatch<React.SetStateAction<boolean>>
) {
  console.log("GraphQL Endpoints:", { http: httpEndpoint, ws: wsEndpoint });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.error(
        "GraphQL エラー:",
        graphQLErrors.map((e) => ({
          message: e.message,
          path: e.path,
          extensions: e.extensions,
        }))
      );
    }
    if (networkError) {
      console.error("ネットワークエラー:", networkError.message);
    }
  });

  // 認証ヘッダーの設定（クライアント側では管理者シークレットは送信しない）
  const authLink = setContext((_, { headers = {} }) => {
    let authHeaders = { ...headers };
    if (token) {
      authHeaders = {
        ...authHeaders,
        Authorization: `Bearer ${token}`,
        "x-hasura-role": role,
        ...(userId ? { "x-hasura-user-id": userId } : {}),
      };
    } else {
      authHeaders = {
        ...authHeaders,
        "x-hasura-role": role,
        ...(userId ? { "x-hasura-user-id": userId } : {}),
      };
    }
    console.log("リクエストヘッダー:", {
      "x-hasura-role": authHeaders["x-hasura-role"],
      Authorization: authHeaders.Authorization ? "exists" : "none",
      "x-hasura-user-id": authHeaders["x-hasura-user-id"] ?? "none",
    });
    return { headers: authHeaders };
  });

  const httpLink = new HttpLink({ uri: httpEndpoint });
  let wsLink: GraphQLWsLink | null = null;
  let wsFailCount = 0;
  const MAX_WS_FAIL_COUNT = 5;

  try {
    if (typeof window !== "undefined") {
      wsLink = new GraphQLWsLink(
        createClient({
          url: wsEndpoint,
          connectionParams: () => {
            const headers = {
              "Content-Type": "application/json",
              "x-hasura-role": role,
              ...(userId ? { "x-hasura-user-id": userId } : {}),
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };
            console.log("GraphQLWsLink connectionParams:", headers);
            return { headers };
          },
          shouldRetry: (err: unknown) => {
            const error = err as Error;
            wsFailCount++;
            console.error("WebSocket 接続エラー、再試行します:", {
              message: error.message,
              retryCount: wsFailCount,
              maxRetries: MAX_WS_FAIL_COUNT,
            });
            if (wsFailCount >= MAX_WS_FAIL_COUNT && setWsConnectionFailed) {
              console.error("WebSocket 接続の再試行回数が上限に達しました。リアルタイム更新を無効化します。");
              setWsConnectionFailed(true);
              return false;
            }
            return wsFailCount < MAX_WS_FAIL_COUNT;
          },
          retryAttempts: MAX_WS_FAIL_COUNT,
          retryWait: (retries) => new Promise((resolve) => setTimeout(resolve, retries * 1000)),
          connectionAckWaitTimeout: 10000,
          on: {
            connected: () => {
              console.log("WebSocket 接続に成功しました", { timestamp: new Date().toISOString() });
              wsFailCount = 0;
              if (setWsConnectionFailed) setWsConnectionFailed(false);
            },
            error: (err: unknown) => {
              const error = err as Error;
              console.error("WebSocket エラーが発生しました:", {
                message: error.message,
                timestamp: new Date().toISOString(),
              });
            },
            closed: () => {
              console.log("WebSocket 接続が閉じられました", { timestamp: new Date().toISOString() });
            },
          },
        })
      );
    }
  } catch (e) {
    console.error("WebSocket クライアントの作成に失敗しました:", {
      error: e instanceof Error ? e.message : String(e),
      timestamp: new Date().toISOString(),
    });
    if (setWsConnectionFailed) setWsConnectionFailed(true);
    wsLink = null;
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

  const enhancedLink = ApolloLink.from([errorLink, splitLink]);

  return new ApolloClient({
    link: enhancedLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: "network-only", errorPolicy: "all" },
      mutate: { fetchPolicy: "network-only", errorPolicy: "all" },
      watchQuery: { fetchPolicy: "network-only", errorPolicy: "all" },
    },
    connectToDevTools: true,
  });
}

export default ApolloWrapper;
