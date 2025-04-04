// src/app/login/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Sppa",
  description: "Login to your Sppa account",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
