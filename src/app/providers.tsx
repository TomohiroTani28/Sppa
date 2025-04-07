// src/app/providers.tsx
"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

import { I18nProvider } from "@/i18n/I18nProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { RealtimeProvider } from "@/contexts/RealtimeContext";

// ApolloClientWrapper は認証が確定してからクライアント側で読み込む
const ApolloWithAuth = dynamic(() => import("./ApolloClientWrapper"), {
  ssr: false,
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <I18nProvider>
        <AuthProvider>
          {/* 先に RealtimeProvider を配置してツリーの再マウントを防ぐ */}
          <RealtimeProvider>
            <ApolloWithAuth>
              {children}
            </ApolloWithAuth>
          </RealtimeProvider>
        </AuthProvider>
      </I18nProvider>
    </SessionProvider>
  );
}
