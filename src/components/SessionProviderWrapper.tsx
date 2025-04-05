// src/components/SessionProviderWrapper.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  session?: any;
}

export default function SessionProviderWrapper({ children, session }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
