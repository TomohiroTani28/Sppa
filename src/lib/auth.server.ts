// src/lib/auth.server.ts
"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type PublicUser = {
  id: string;
  name: string | null;
  email: string;
  role: "tourist" | "therapist" | string;
  profile_picture: string | null;
  phone_number?: string;
  verified_at?: string;
  last_login_at?: string;
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
    phone_number: undefined,
    verified_at: undefined,
    last_login_at: undefined,
    created_at: "",
    updated_at: "",
  };
}