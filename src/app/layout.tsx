"use client";
// src/app/layout.tsx
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}