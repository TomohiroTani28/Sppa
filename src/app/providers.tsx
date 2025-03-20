"use client";
// src/app/providers.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { I18nProvider } from "./i18n/I18nProvider";
import { ApolloWrapper } from "./ApolloWrapper";

interface ProvidersProps {
  children: ReactNode;
  lng?: string;
}

export function Providers({ children, lng = "en" }: ProvidersProps) {
  // QueryClientを作成（Reactのステートとして保持）
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5分
          },
        },
      }),
  );

  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </I18nProvider>
  );
}
