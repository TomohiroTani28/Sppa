// src/lib/supabase-client.ts
"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient = createPagesBrowserClient({
  cookieOptions: {
    name: 'sb',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    domain: undefined,
  },
});

export default supabase;
