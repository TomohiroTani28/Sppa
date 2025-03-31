// src/lib/auth.server.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function verifyIdToken(token: string) {
  if (!token) return null;
  
  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    console.error("Error verifying token:", error.message);
    return null;
  }
  
  return data.user;
}