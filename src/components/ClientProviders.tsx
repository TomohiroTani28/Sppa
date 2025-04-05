"use client";
// src/components/ClientProviders.tsx
import React from "react";
import { Providers } from "@/app/providers";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return <Providers>{children}</Providers>;
}
