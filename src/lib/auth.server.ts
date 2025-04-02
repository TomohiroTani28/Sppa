import { createClient } from '@supabase/supabase-js';
import { User } from "@/types/user";

// 環境変数の読み込み
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ supabaseUrl:", supabaseUrl);
  console.error("❌ supabaseKey:", supabaseKey);
  throw new Error("Supabase URL and/or Key is missing");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

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

export async function auth(): Promise<SppaUser | null> {
  const token = process.env.SUPABASE_TEMP_TOKEN || "";
  if (!token) {
    console.error("No token provided for authentication");
    return null;
  }

  const user = await verifyIdToken(token);
  if (!user) return null;

  return mapSupabaseUserToSppaUser(user);
}
