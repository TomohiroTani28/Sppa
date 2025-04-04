// src/components/ClientProviders.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import ApolloWrapper from "@/app/ApolloWrapper";
import { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ApolloWrapper>{children}</ApolloWrapper>
      </AuthProvider>
    </SessionProvider>
  );
}