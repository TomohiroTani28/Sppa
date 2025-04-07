// src/app/ApolloClientWrapper.tsx
"use client";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { ReactNode, useMemo } from "react";

interface Props {
  children: ReactNode;
}

export default function ApolloClientWrapper({ children }: Props) {
  const client = useMemo(() => {
    const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT,
      credentials: "include",
    });

    // WebSocket はブラウザだけ
    const wsLink =
      typeof window !== "undefined"
        ? new GraphQLWsLink(
            createClient({
              url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT!.replace(
                /^http/,
                "ws"
              ),
              connectionParams: async () => {
                // 例：JWT を付けたい場合
                const token = localStorage.getItem("sppa_auth_token");
                return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
              },
            })
          )
        : null;

    const link = wsLink
      ? split(
          ({ query }) => {
            const def = getMainDefinition(query);
            return (
              def.kind === "OperationDefinition" && def.operation === "subscription"
            );
          },
          wsLink,
          httpLink
        )
      : httpLink;

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
      connectToDevTools: process.env.NODE_ENV === "development",
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
