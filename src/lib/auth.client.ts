// src/lib/auth.client.ts
"use client";
import { useSession } from "next-auth/react";

// Define the custom user type
export type SppaUser = {
  id: string;
  name: string | null;
  email: string;
  role: "tourist" | "therapist" | "common";
  profile_picture: string | null;
  phone_number: string | null;
  verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

// Extend next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      phone_number?: string;
      verified_at?: string;
      last_login_at?: string;
      created_at?: string;
      updated_at?: string;
    };
  }
}

export function useAuthClient(): { user: SppaUser | null; loading: boolean } {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading || !session?.user) {
    return { user: null, loading };
  }

  const user: SppaUser = {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: (session.user.role as "tourist" | "therapist" | "common") ?? "tourist",
    profile_picture: session.user.image ?? null,
    phone_number: session.user.phone_number ?? null,
    verified_at: session.user.verified_at ?? null,
    last_login_at: session.user.last_login_at ?? null,
    created_at: session.user.created_at ?? "",
    updated_at: session.user.updated_at ?? "",
  };

  return { user, loading };
}

export default function useSessionRole(): "tourist" | "therapist" | "common" | null {
  const { user } = useAuthClient();
  return user ? user.role : null;
}