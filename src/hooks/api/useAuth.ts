"use client";
// src/hooks/api/useAuth.ts
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface AuthState {
  user: any;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const { data: session, status } = useSession();
  console.log("[useAuth] Session status:", status);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);

  useEffect(() => {
    const fetchJwt = async () => {
      if (status === "authenticated" && !jwtToken && !isLoadingToken) {
        setIsLoadingToken(true);
        try {
          const response = await fetch("/api/auth/get-jwt");
          if (response.ok) {
            const data = await response.json();
            setJwtToken(data.token || null);
            console.log("[useAuth] ✅ Successfully fetched JWT token.");
          } else {
            throw new Error(`Fetch failed: ${response.status}`);
          }
        } catch (error) {
          console.error("[useAuth] ❌ Failed to fetch JWT token:", error);
          setJwtToken(null);
        } finally {
          setIsLoadingToken(false);
        }
      } else if (status === "unauthenticated") {
        setJwtToken(null);
        console.log("[useAuth] User unauthenticated, JWT token cleared.");
      }
    };

    fetchJwt();
  }, [status]);

  const userRole = (session?.user as any)?.role || null;
  const isLoading = status === "loading" || isLoadingToken;

  return {
    user: session?.user || null,
    token: jwtToken,
    role: userRole,
    profile_picture: session?.user?.image || null,
    loading: isLoading,
  };
};

export default useAuth;