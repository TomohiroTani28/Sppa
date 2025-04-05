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
        {/* Providers で全体をラップすることで、各コンテキストが利用可能 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}