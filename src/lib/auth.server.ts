// src/lib/auth.server.ts
"use server";

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { User } from "@/types/user";
import jwt from "jsonwebtoken";

type PublicUser = Omit<User, "password_hash">;

/**
 * Supabaseの認証ユーザー情報を取得し、PublicUserとして返す
 */
export async function auth(): Promise<PublicUser | null> {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

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

/**
 * JWT形式のIDトークンを検証してデコードされたペイロードを返す
 * @param token JWT IDトークン
 * @returns トークンが有効な場合はデコードされた情報、無効な場合はnull
 */
export function verifyIdToken(token: string): Record<string, any> | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, secret);
    return typeof decoded === "string" ? { sub: decoded } : decoded;
  } catch (err) {
    console.error("❌ Failed to verify ID token:", err);
    return null;
  }
}
