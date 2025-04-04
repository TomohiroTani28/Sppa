"use client";
// src/app/providers.tsx
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/i18n/I18nProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
import ApolloWrapper from "./ApolloWrapper";
import { RealtimeProvider } from "@/contexts/RealtimeContext";

interface ProvidersProps {
  children: ReactNode;
  lng?: string;
}

export function Providers({ children, lng = "en" }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <AuthProvider>
        <ApolloWrapper>
          <I18nProvider>
            <QueryClientProvider client={queryClient}>
              <RealtimeProvider>
                {children}
              </RealtimeProvider>
            </QueryClientProvider>
          </I18nProvider>
        </ApolloWrapper>
      </AuthProvider>
    </SessionProvider>
  );
}
