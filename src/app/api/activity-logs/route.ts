// src/app/api/activity-logs/route.ts
import { NextResponse } from "next/server";

// アクティビティログを記録するためのPOSTリクエストハンドラー
export async function POST(request: Request) {
  try {
    // リクエストボディをJSONとしてパース
    const body = await request.json();
    console.log("Activity log:", body);

    // ここでデータベースにログを保存する処理を追加（例: SupabaseやHasuraを使用）
    // 例: await supabase.from('activity_logs').insert([body]);

    // 成功レスポンスを返す
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
  }
}