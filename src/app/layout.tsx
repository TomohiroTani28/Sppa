// src/app/layout.tsx
"use client";

import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";
import ToastProvider from "@/components/ui/Toast";
import { ApolloWrapper } from "./ApolloWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-background text-foreground">
        <SessionProvider>
          <ApolloWrapper>
            <Providers>
              <ToastProvider>{children}</ToastProvider>
            </Providers>
          </ApolloWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
