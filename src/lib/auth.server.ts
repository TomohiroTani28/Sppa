// src/lib/auth.server.ts
"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/types/user";

export type PublicUser = Omit<User, "password_hash">;

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

    // nullをundefinedに修正
    phone_number: undefined,
    verified_at: undefined,
    last_login_at: undefined,

    created_at: "",
    updated_at: "",
  };
}
