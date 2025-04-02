// src/app/layout.tsx
import "../styles/globals.css";
import { ApolloWrapper } from "@/app/ApolloWrapper";
import { Providers } from "@/app/providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-background text-foreground">
        <Providers>
          <ApolloWrapper>{children}</ApolloWrapper>
        </Providers>
      </body>
    </html>
  );
}
