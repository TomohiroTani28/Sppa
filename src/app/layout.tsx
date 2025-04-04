// src/app/layout.tsx
import { SessionProvider } from "next-auth/react";
import ApolloWrapper from "@/app/ApolloWrapper";
import "@/styles/globals.css";
import "@/i18n/i18n";

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body>
        <SessionProvider>
          <ApolloWrapper>{children}</ApolloWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}