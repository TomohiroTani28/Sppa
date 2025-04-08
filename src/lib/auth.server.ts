// src/lib/auth.server.ts
"use server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export type PublicUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  profile_picture: string | null;
  phone_number: string | null;
  verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function auth(): Promise<PublicUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    console.error("❌ No session found or no user in session");
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? "",
    role: (session.user as any).role ?? "tourist",
    profile_picture: session.user.image ?? null,
    phone_number: null,
    verified_at: null,
    last_login_at: null,
    created_at: "",
    updated_at: "",
  };
}