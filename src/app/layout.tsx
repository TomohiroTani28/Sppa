// src/app/layout.tsx
import "@/styles/globals.css";
import { Metadata } from 'next';
import React from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: 'Sppa - Connect with therapists in Bali',
  description: 'Find and book therapists for wellness and relaxation in Bali',
  viewport: 'width=device-width, initial-scale=1',
};

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