// src/lib/supabase-client.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// 環境変数のチェック
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or Supabase Key is missing. Check your .env file."
  );
}

// Supabase クライアントの作成
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// 開発環境ではデバッグログを出力
if (process.env.NODE_ENV === "development") {
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
