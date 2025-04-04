// src/app/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase-client";
import ApolloWrapper from "@/app/ApolloWrapper";
import "@/styles/globals.css";
import "@/i18n/i18n";

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { data: session, status } = useSession();
  const [supabaseSession, setSupabaseSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSupabaseSession(data.session);
      setLoading(false);
      console.log("Supabase initial session:", data.session);
    };
    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Supabase auth event:", event, session);
      setSupabaseSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    console.log("NextAuth session:", session, "Status:", status);
  }, [session, status]);

  if (loading || status === "loading") {
    return <div>セッションを確認中...</div>;
  }

  return (
    <html lang="ja">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}