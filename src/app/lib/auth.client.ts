// src/app/lib/auth.client.ts
import { User } from "@/types/user";
import supabase from "./supabase-client";

// Sppa 用のユーザー型（User を拡張しつつ Supabase の実態に合わせる）
interface SppaUser extends Omit<User, 'password_hash'> {
  password_hash?: string; // Supabase では取得不可のためオプショナル
}

// Supabase ユーザーから SppaUser へのマッピング
const mapSupabaseUserToSppaUser = (user: any): SppaUser => {
  return {
    id: user.id,
    name: user.user_metadata?.name || null, // User に準拠（string | null）
    email: user.email || "",
    role: (user.user_metadata?.role as 'tourist' | 'therapist') || 'tourist', // デフォルト値で必須性を保証
    profile_picture: user.user_metadata?.profile_picture || null,
    phone_number: user.user_metadata?.phone_number,
    verified_at: user.email_confirmed_at,
    last_login_at: user.last_sign_in_at,
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
    password_hash: undefined,
  };
};

// ユーザー取得関数
export async function getUser(): Promise<SppaUser | null> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Error fetching user from Supabase:", error?.message);
    return null;
  }

  const sppaUser = mapSupabaseUserToSppaUser(user);
  console.log("User fetched successfully:", sppaUser.email);
  return sppaUser;
}