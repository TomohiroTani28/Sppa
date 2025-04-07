// src/app/providers.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { RealtimeProvider } from "@/contexts/RealtimeContext";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ReactNode } from "react";
import dynamic from "next/dynamic";

// ApolloClientWrapperを動的インポートして認証済みユーザーにのみ提供
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
          <ApolloWithAuth>
            <RealtimeProvider>
              {children}
            </RealtimeProvider>
          </ApolloWithAuth>
        </AuthProvider>
      </I18nProvider>
    </SessionProvider>
  );
}