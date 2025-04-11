// src/app/providers.tsx
"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { RealtimeProvider } from "@/contexts/RealtimeContext";
import { graphqlClient } from "@/lib/graphql-client";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
// i18nextの初期化を追加
import "@/lib/i18n";
// Toasterのインポートを一時的に削除
// import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ApolloProvider client={graphqlClient}>
        <AuthProvider>
          <RealtimeProvider>
            {children}
            {/* Toasterコンポーネントを一時的にコメントアウト */}
            {/* <Toaster position="top-right" /> */}
          </RealtimeProvider>
        </AuthProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}
