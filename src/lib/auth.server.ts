// src/lib/auth.server.ts
"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/types/user";

type PublicUser = Omit<User, "password_hash">;

function createPublicUserFromSession(session: any): PublicUser | null {
  if (!session?.user) return null;

  return {
    id: session.user.id,
    name: session.user.name || undefined,
    email: session.user.email || "",
    role: session.user.role || "tourist",
    profile_picture: session.user.image || undefined,
    phone_number: undefined,
    verified_at: undefined,
    last_login_at: undefined,
    created_at: "",
    updated_at: "",
  };
}

export async function auth(): Promise<PublicUser | null> {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.error("❌ No session found");
    return null;
  }
  const publicUser = createPublicUserFromSession(session);
  if (!publicUser) {
    console.error("❌ No user found in session");
  } else {
    console.log("✅ NextAuth session success:", publicUser);
  }
  return publicUser;
}
