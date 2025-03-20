// src/app/api/experiences/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export interface LocalExperience {
  id: string;
  title: string;
  description: string;
  location: string;
  category_id?: string;
  thumbnail_url: string;
  created_at?: string;
  updated_at?: string;
}

// バックアップとして使用するモックデータ
const mockExperiences: LocalExperience[] = [
  {
    id: "mock-1",
    title: "バリニーズマッサージ体験",
    description:
      "伝統的なバリニーズマッサージを体験できます。海を眺めながらリラックスした時間をお過ごしください。",
    location: "ウブド, バリ島",
    thumbnail_url: "/images/event1.jpg",
  },
  {
    id: "mock-2",
    title: "ライステラスツアー",
    description:
      "美しいライステラス（棚田）を訪れ、地元のガイドと一緒にバリ島の農業文化について学びます。",
    location: "テガララン, バリ島",
    thumbnail_url: "/images/event2.jpg",
  },
  {
    id: "mock-3",
    title: "サンセットヨガクラス",
    description:
      "ビーチでのサンセットヨガセッションに参加して、心と体のバランスを整えましょう。",
    location: "クタ, バリ島",
    thumbnail_url: "/images/event3.jpg",
  },
];

function handleSupabaseError(error: any) {
  console.error("Supabase query error:", error);
  return NextResponse.json(
    {
      error: "ローカル体験の取得に失敗しました",
      details: error.message,
      code: error.code || "UNKNOWN_ERROR",
    },
    { status: 500 },
  );
}

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn(
        "Supabaseの環境変数が設定されていません。モックデータを使用します。",
      );
      return NextResponse.json(mockExperiences);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // クエリパラメーターの取得（オプション）
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const category = url.searchParams.get("category");

    // クエリの構築
    let query = supabase
      .from("local_experiences")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    // カテゴリーフィルターが指定されている場合
    if (category) {
      query = query.eq("category_id", category);
    }

    // データの取得
    const { data, error } = await query;

    if (error) return handleSupabaseError(error);

    // データが存在しない場合はモックデータを返す
    if (!data || data.length === 0) {
      console.warn(
        "ローカル体験データが存在しません。モックデータを使用します。",
      );
      return NextResponse.json(mockExperiences);
    }

    // データの整形
    const experiences: LocalExperience[] = data.map((exp) => ({
      id: exp.id,
      title: exp.title || "無題の体験",
      description: exp.description || "説明はありません",
      location: exp.location || "バリ島",
      category_id: exp.category_id,
      thumbnail_url: exp.thumbnail_url || "/images/event1.jpg",
      created_at: exp.created_at,
      updated_at: exp.updated_at,
    }));

    return NextResponse.json(experiences);
  } catch (error) {
    console.error(
      "ローカル体験の取得中に予期しないエラーが発生しました:",
      error,
    );
    return NextResponse.json(
      {
        error: "予期しないエラーが発生しました",
        details: error instanceof Error ? error.message : "不明なエラー",
        fallback: true,
        data: mockExperiences,
      },
      { status: 200 },
    );
  }
}