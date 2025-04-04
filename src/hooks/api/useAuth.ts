// src/hooks/api/useAuth.ts
"use client";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

interface AuthState {
  user: Session["user"] | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const { data: session, status } = useSession();

  return {
    user: session?.user || null,
    token: session?.access_token || null, // 注意: access_token は next-auth の設定による
    role: session?.user?.role || null,
    profile_picture: session?.user?.image || null,
    loading: status === "loading",
  };
};

export default useAuth;