// src/app/ClientLayout.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import ApolloClientWrapper from "./ApolloClientWrapper";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface ClientLayoutProps {
  session: any; // Replace with proper session type from next-auth
  children: React.ReactNode;
}

export default function ClientLayout({ session, children }: ClientLayoutProps) {
  return (
    <SessionProvider session={session}>
      <AuthenticatedContent>{children}</AuthenticatedContent>
    </SessionProvider>
  );
}

function AuthenticatedContent({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading authentication...</div>;
  }

  return isAuthenticated ? (
    <ApolloClientWrapper>{children}</ApolloClientWrapper>
  ) : (
    <>{children}</>
  );
}