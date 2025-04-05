// src/app/layout.tsx
import "@/styles/globals.css";
import "@/i18n/i18n";
import { Providers } from "@/app/providers";

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <head>
        {/* 必要に応じてメタタグやタイトルを追加 */}
      </head>
      <body>
        {/* Providers で全体をラップすることで、SessionProvider、AuthProvider、ApolloWrapper、I18nProvider、
            QueryClientProvider、RealtimeProvider の各コンテキストが利用可能になります */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
