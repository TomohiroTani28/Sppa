// src/app/layout.tsx
"use client";

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import "@/i18n/i18n";
import ApolloWrapper from "@/app/ApolloWrapper";
import "@/styles/globals.css";

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <html lang="ja">
      <body>
        <SessionContextProvider supabaseClient={supabaseClient}>
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </SessionContextProvider>
      </body>
    </html>
  );
}
