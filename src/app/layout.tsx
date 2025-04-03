// src/app/layout.tsx
"use client";

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import supabase from "@/lib/supabase-client"; // ← ここを統一
import "@/i18n/i18n";
import ApolloWrapper from "@/app/ApolloWrapper";
import "@/styles/globals.css";

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body>
        <SessionContextProvider supabaseClient={supabase}>
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </SessionContextProvider>
      </body>
    </html>
  );
}
