// src/app/layout.tsx
"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { Session } from "@supabase/auth-helpers-nextjs"; // 型注釈を追加
import supabase from "@/lib/supabase-client";
import { useState, useEffect } from "react";
import "@/i18n/i18n";
import ApolloWrapper from "@/app/ApolloWrapper";
import "@/styles/globals.css";

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [initialSession, setInitialSession] = useState<Session | null>(null); // 🔧 型注釈を追加

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setInitialSession(data.session);
    };
    loadSession();
  }, []);

  if (initialSession === null) {
    return <div>セッションを確認中...</div>;
  }

  return (
    <html lang="ja">
      <body>
        <SessionContextProvider
          supabaseClient={supabase}
          initialSession={initialSession}
        >
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </SessionContextProvider>
      </body>
    </html>
  );
}
