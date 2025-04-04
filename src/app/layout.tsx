"use client";
// src/app/layout.tsx
import { SessionProvider } from "next-auth/react";
import ApolloWrapper from "@/app/ApolloWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/styles/globals.css";
import "@/i18n/i18n";

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ApolloWrapper>{children}</ApolloWrapper>
      </AuthProvider>
    </SessionProvider>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}