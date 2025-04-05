// src/lib/auth.client.ts
"use client";
import { useSession } from "next-auth/react";

export type SppaUser = {
  id: string;
  name?: string;
  email: string;
  role: "tourist" | "therapist" | string;
  profile_picture?: string;
  phone_number?: string;
  verified_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
};

export function useAuthClient(): { user: SppaUser | null; loading: boolean } {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading || !session || !session.user) {
    return { user: null, loading };
  }

  const user: SppaUser = {
    id: session.user.id,
    name: session.user.name ?? undefined,
    email: session.user.email ?? "",
    role: (session.user as any).role ?? "tourist",
    profile_picture: session.user.image ?? undefined,
    phone_number: undefined,
    verified_at: undefined,
    last_login_at: undefined,
    created_at: "",
    updated_at: "",
  };

  return { user, loading };
}

// getSessionRole 関数を追加
const getSessionRole = async (): Promise<"tourist" | "therapist" | "common" | null> => {
  const { user } = useAuthClient();
  return user ? (user.role as "tourist" | "therapist" | "common") : null;
};

// デフォルトエクスポートとして定義
export default getSessionRole;