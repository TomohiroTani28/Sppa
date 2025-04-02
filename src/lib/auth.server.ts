// src/lib/auth.server.ts

import { createClient } from '@supabase/supabase-js';
import { User } from "@/types/user";

// サーバー側の環境変数を使用してSupabaseクライアントを作成
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

interface SppaUser extends Omit<User, "password_hash"> {
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

export async function verifyIdToken(token: string) {
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    console.error("Error verifying token:", error.message);
    return null;
  }

  return data.user;
}

// 認証関数（仮のトークン取得方法）
export async function auth(): Promise<SppaUser | null> {
  // 本番ではヘッダーやCookieから取得すること
  const token = process.env.SUPABASE_TEMP_TOKEN || "";
  if (!token) {
    console.error("No token provided for authentication");
    return null;
  }

  const user = await verifyIdToken(token);
  if (!user) return null;

  return mapSupabaseUserToSppaUser(user);
}
