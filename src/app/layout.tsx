// src/app/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import ApolloClientWrapper from "./ApolloClientWrapper";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <html lang="en">
      <body>
        {isAuthenticated ? (
          <ApolloClientWrapper>{children}</ApolloClientWrapper>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}