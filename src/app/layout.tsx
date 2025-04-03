// src/app/layout.tsx
"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { Session } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase-client";
import ApolloWrapper from "@/app/ApolloWrapper";
import "@/styles/globals.css";
import "@/i18n/i18n";

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    // セッションの変化も監視
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>セッションを確認中...</div>;
  }

  return (
    <html lang="ja">
      <body>
        <SessionContextProvider supabaseClient={supabase} initialSession={session}>
          <ApolloWrapper>{children}</ApolloWrapper>
        </SessionContextProvider>
      </body>
    </html>
  );
}
