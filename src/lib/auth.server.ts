// src/lib/auth.server.ts
"use server";

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { User } from "@/types/user";
import jwt from "jsonwebtoken";

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

export async function verifyIdToken(token: string): Promise<PublicUser | null> {
  try {
    if (!token) return null;

    // 環境変数に設定した JWT シークレットを利用してトークン検証
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      console.error("Missing SUPABASE_JWT_SECRET env variable");
      return null;
    }

    // JWT の検証（必要に応じてオプションの設定も追加してください）
    const decoded = jwt.verify(token, secret) as any;

    return {
      id: decoded.sub,
      name: decoded.name || null,
      email: decoded.email ?? "",
      role: decoded.role || "tourist",
      profile_picture: decoded.profile_picture ?? null,
      phone_number: decoded.phone_number,
      verified_at: decoded.email_confirmed_at,
      last_login_at: decoded.last_sign_in_at,
      created_at: decoded.created_at,
      updated_at: decoded.updated_at || decoded.created_at,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
