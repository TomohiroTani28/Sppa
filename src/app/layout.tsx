// src/app/layout.tsx
import "@/styles/globals.css";
import "@/i18n/i18n";
import ClientProviders from "@/components/ClientProviders";

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
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
