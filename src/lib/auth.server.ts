// src/lib/auth.server.ts
"use server";

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { User } from "@/types/user";

type PublicUser = Omit<User, "password_hash">;

export async function auth(): Promise<PublicUser | null> {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("❌ Supabase auth error:", error?.message);
    return null;
  }

  return {
    id: user.id,
    name: user.user_metadata?.name || null,
    email: user.email ?? "",
    role: user.user_metadata?.role || "tourist",
    profile_picture: user.user_metadata?.profile_picture ?? null,
    phone_number: user.user_metadata?.phone_number,
    verified_at: user.email_confirmed_at,
    last_login_at: user.last_sign_in_at,
    created_at: user.created_at,
    updated_at: user.updated_at ?? user.created_at,
  };
}
