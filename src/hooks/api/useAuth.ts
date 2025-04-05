// src/hooks/api/useAuth.ts
"use client";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

interface AuthState {
  session: Session | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return {
    session,
    loading: isLoading,
  };
};

export default useAuth;