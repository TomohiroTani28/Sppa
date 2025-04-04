"use server";
// src/lib/auth.server.ts
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { User } from "@/types/user";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

type PublicUser = Omit<User, "password_hash">;

async function getSupabaseUser(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    console.error("❌ Supabase auth error:", error?.message || "No user found");
    return null;
  }
  return user;
}

function createPublicUser(user: any): PublicUser {
  return {
    id: user.id,
    name: user.user_metadata?.name ?? null,
    email: user.email ?? "",
    role: user.user_metadata?.role ?? "tourist",
    profile_picture: user.user_metadata?.profile_picture ?? null,
    phone_number: user.user_metadata?.phone_number,
    verified_at: user.email_confirmed_at,
    last_login_at: user.last_sign_in_at,
    created_at: user.created_at,
    updated_at: user.updated_at ?? user.created_at,
  };
}

export async function auth(): Promise<PublicUser | null> {
  const cookieStore: ReadonlyRequestCookies = await cookies(); // await を追加
  const authToken = cookieStore.get("sb-dekywgvyrryedutqacib-auth-token");

  if (!authToken) {
    console.error("❌ No auth token found in cookies");
    return null;
  }

  const supabase = createServerComponentClient<Database>({
    cookies: () => cookies(),
  });

  const user = await getSupabaseUser(supabase);
  if (!user) return null;

  console.log("✅ Supabase auth success:", {
    id: user.id,
    email: user.email,
    role: user.user_metadata?.role,
  });

  return createPublicUser(user);
}