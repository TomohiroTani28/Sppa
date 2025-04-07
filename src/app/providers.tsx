// src/app/providers.tsx
"use client";

import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    from,
    HttpLink,
    InMemoryCache,
    split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, useMemo } from "react";

import { AuthProvider } from "@/contexts/AuthContext";
import { RealtimeProvider } from "@/contexts/RealtimeContext";
import { I18nProvider } from "@/i18n/I18nProvider";

type ReadonlyChildren = Readonly<{ children: ReactNode }>;

function ApolloWrapper({ children }: ReadonlyChildren) {
  const { data: session, status } = useSession();

  const client = useMemo(() => {
    // エラーハンドリング用のリンク
    const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        for (const err of graphQLErrors) {
          console.error(`[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`);
          
          // 認証エラーの場合の処理
          if (err.message.includes("Forbidden") || err.message.includes("Unauthorized")) {
            console.warn("認証エラーが発生しました。セッションを確認してください。");
            // 必要に応じてリダイレクトなどの処理を追加
          }
        }
      }
      
      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
      
      // エラーが発生しても処理を続行
      return forward(operation);
    });

    /* ---------- HTTP ---------- */
    const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT,
      credentials: "include",
      headers: session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {},
    });

    /* ---------- WebSocket ---------- */
    let link: ApolloLink = from([errorLink, httpLink]);  // エラーハンドリングを追加
    
    if (typeof window !== "undefined") {
      try {
        const wsLink = new GraphQLWsLink(
          createClient({
            url: process
              .env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT!
              .replace(/^http/, "ws"),
            connectionParams: () => {
              // セッションがロード中または未認証の場合は空のオブジェクトを返す
              if (status === "loading" || !session?.access_token) {
                return {};
              }
              
              return {
                headers: {
                  Authorization: `Bearer ${session.access_token}`
                }
              };
            },
            retryAttempts: 3, // 再接続を試みる回数
            shouldRetry: (errOrCloseEvent: any) => {
              // 認証エラー以外のエラーで再接続を試みる
              const message = errOrCloseEvent.message || '';
              return !message.includes("Forbidden") && 
                     !message.includes("Unauthorized");
            },
          })
        );

        // query/mutation → HTTP, subscription → WS
        link = split(
          ({ query }) => {
            const def = getMainDefinition(query);
            return (
              def.kind === "OperationDefinition" && def.operation === "subscription"
            );
          },
          wsLink,
          link
        );
      } catch (error) {
        console.error("WebSocket接続の初期化に失敗しました:", error);
        // WebSocket接続に失敗した場合はHTTPリンクのみを使用
      }
    }

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
      connectToDevTools: process.env.NODE_ENV === "development",
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
  }, [session?.access_token, status]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function Providers({ children }: ReadonlyChildren) {
  return (
    <SessionProvider>
      <I18nProvider>
        <AuthProvider>
          <ApolloWrapper>
            <RealtimeProvider>{children}</RealtimeProvider>
          </ApolloWrapper>
        </AuthProvider>
      </I18nProvider>
    </SessionProvider>
  );
}
