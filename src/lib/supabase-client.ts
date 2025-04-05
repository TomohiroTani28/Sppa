// src/lib/supabase-client.ts
"use client";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase configuration error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in the environment variables."
  );
}

const supabase: SupabaseClient = createPagesBrowserClient({
  supabaseUrl,
  supabaseKey,
  cookieOptions: {
    name: "sb",
    path: "/",
    sameSite: "Lax",
    secure: process.env.NODE_ENV === 'production', // 本番環境では true
    domain: undefined,
  },
});

export default supabase;