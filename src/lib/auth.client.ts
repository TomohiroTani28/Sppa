// src/lib/auth.client.ts
import { User } from "@/types/user";
import supabase from "@/lib/supabase-client";

export interface SppaUser extends Omit<User, "password_hash"> {
  password_hash?: string;
}

const mapSupabaseUserToSppaUser = (user: any): SppaUser => {
  return {
    id: user.id,
    name: user.user_metadata?.name || null,
    email: user.email || "",
    role: (user.user_metadata?.role as "tourist" | "therapist") || "tourist",
    profile_picture: user.user_metadata?.profile_picture || null,
    phone_number: user.user_metadata?.phone_number,
    verified_at: user.email_confirmed_at,
    last_login_at: user.last_sign_in_at,
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
    password_hash: undefined,
  };
};

export async function getUser(): Promise<SppaUser | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error?.message === "Auth session missing!") {
    // ユーザー未ログイン時は警告ではなく情報として扱う
    console.info("No active session found (user not logged in).");
    return null;
  }

  if (error || !user) {
    console.error("Error fetching user from Supabase:", error?.message);
    return null;
  }

  const sppaUser = mapSupabaseUserToSppaUser(user);
  console.log("✅ User fetched successfully:", sppaUser.email);
  return sppaUser;
}

export default async function getSessionRole(): Promise<"tourist" | "therapist" | null> {
  const user = await getUser();
  return user ? (user.role as "tourist" | "therapist") : null;
}