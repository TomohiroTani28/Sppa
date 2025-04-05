// src/app/layout.tsx
import "@/styles/globals.css";
import "@/i18n/i18n";
import ApolloWrapper from "@/app/ApolloWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientProviders from "@/components/ClientProviders";

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <head>
        {/* No <link> tag needed here */}
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}