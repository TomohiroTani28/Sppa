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
        <title>My App</title>
        {/* 必要に応じてメタタグやその他のヘッド要素を追加 */}
      </head>
      <body>
        {/* Providers で全体をラップすることで、各種コンテキストが利用可能になります */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
