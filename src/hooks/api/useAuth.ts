// src/hooks/api/useAuth.ts
"use client";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useState, useEffect } from "react";

interface AuthState {
  user: Session["user"] | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const { data: session, status } = useSession();
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);

  useEffect(() => {
    const fetchJwt = async () => {
      console.log("[useAuth] fetchJwt started. Status:", status, "JWT Token:", jwtToken);
      if (status === "authenticated" && !jwtToken) {
        setIsLoadingToken(true);
        try {
          console.log("[useAuth] Attempting to fetch JWT from /api/auth/get-jwt");
          const response = await fetch('/api/auth/get-jwt');
          console.log("[useAuth] Response received:", response);
          if (response.ok) {
            const data = await response.json();
            setJwtToken(data.token || null);
            console.log("[useAuth] ✅ Successfully fetched JWT token from API route.");
          } else {
            console.error("[useAuth] ❌ Failed to fetch JWT token:", response.status, response.statusText);
            setJwtToken(null);
          }
        } catch (error) {
          console.error("[useAuth] ❌ Error fetching JWT token:", error);
          setJwtToken(null);
        } finally {
          setIsLoadingToken(false);
          console.log("[useAuth] fetchJwt finished. JWT Token:", jwtToken, "Loading:", isLoadingToken);
        }
      } else if (status === "unauthenticated") {
        setJwtToken(null);
        console.log("[useAuth] User unauthenticated, JWT token cleared.");
      }
    };

    fetchJwt();
  }, [status, jwtToken]);

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