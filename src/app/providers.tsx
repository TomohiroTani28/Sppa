// src/app/providers.tsx
"use client";

import { ReactNode, useMemo } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  split,
  ApolloLink,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { SessionProvider, useSession } from "next-auth/react";

import { I18nProvider } from "@/i18n/I18nProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { RealtimeProvider } from "@/contexts/RealtimeContext";

type ReadonlyChildren = Readonly<{ children: ReactNode }>;

function ApolloWrapper({ children }: ReadonlyChildren) {
  const { data: session } = useSession();

  const client = useMemo(() => {
    /* ---------- HTTP ---------- */
    const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT,
      credentials: "include",
      headers: session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {},
    });

    /* ---------- WebSocket ---------- */
    let link: ApolloLink = httpLink;          // ★ 型を固定
    if (typeof window !== "undefined") {
      const wsLink = new GraphQLWsLink(
        createClient({
          url: process
            .env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT!
            .replace(/^http/, "ws"),
          connectionParams: () =>
            session?.access_token
              ? { headers: { Authorization: `Bearer ${session.access_token}` } }
              : {},
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
        httpLink
      );
    }

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
      connectToDevTools: process.env.NODE_ENV === "development",
    });
  }, [session?.access_token]);

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
