// src/hooks/api/useAuth.ts
"use client";
import { useSession } from "next-auth/react";

interface AuthState {
  user: any | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const { data: session, status } = useSession();

  return {
    user: session?.user || null,
    token: session?.access_token || null,
    role: session?.user?.role || null,
    profile_picture: session?.user?.image || null,
    loading: status === "loading",
  };
};

export default useAuth;