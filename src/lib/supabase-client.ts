// src/lib/supabase-client.ts
"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

// Supabase クライアントのシングルトンを作成
const supabase: SupabaseClient = createPagesBrowserClient();

// 開発環境ではデバッグログを出力
if (process.env.NODE_ENV === "development") {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("✅ Supabase URL:", supabaseUrl);
  console.log(
    "✅ Supabase Anon Key:",
    supabaseAnonKey ? "✔ Loaded" : "❌ Not Loaded"
  );
}

/**
 * メディアファイルをアップロード
 * @param file アップロードするファイル
 * @param mediaType "image" | "video"
 * @returns アップロード成功時のデータ
 */
export async function uploadMedia(file: File, mediaType: "image" | "video") {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${mediaType}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("media-bucket")
    .upload(filePath, file);

  if (error) {
    console.error("❌ Supabase Upload Error:", error);
    throw error;
  }
  return data;
}

export default supabase;
