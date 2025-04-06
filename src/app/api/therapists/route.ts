// src/app/api/therapists/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


export interface TherapistProfile {
  id: string;
  user_id: string;
  name: string;
  profile_picture?: string;
  bio?: string;
  rating?: number;
  experience_years?: number;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  languages?: string[];
  price_range_min?: number;
  price_range_max?: number;
  currency?: string;
  business_name?: string;
  status?: string;
  services?: {
    id: string;
    service_name: string;
    price: number;
    currency: string;
    duration: number;
    category_name?: string;
  }[];
}

function handleSupabaseError(error: any) {
  console.error("Supabase query error:", error);
  return NextResponse.json(
    {
      error: "セラピスト情報の取得に失敗しました",
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
      return NextResponse.json(
        { error: "Supabase環境変数が設定されていません" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // クエリパラメータ
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const page = parseInt(url.searchParams.get("page") || "0");
    const search = url.searchParams.get("search");
    const categoryId = url.searchParams.get("category");
    const minPrice = url.searchParams.get("min_price");
    const maxPrice = url.searchParams.get("max_price");
    const preferredLanguage = url.searchParams.get("language");
    const offset = page * limit;

    // ユーザー情報とセラピストプロフィールを結合して取得
    let query = supabase
      .from("therapist_profiles")
      .select(
        `
        *,
        user:users!inner(id, name, profile_picture, role)
      `,
      )
      .eq("user.role", "therapist") // セラピストロールのみ
      .order("rating", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    // 検索フィルター
    if (search) {
      query = query.or(`user.name.ilike.%${search}%, bio.ilike.%${search}%`);
    }

    // 言語フィルター
    if (preferredLanguage) {
      query = query.contains("languages", [preferredLanguage]);
    }

    // 価格範囲フィルター
    if (minPrice) {
      query = query.gte("price_range_min", parseInt(minPrice));
    }
    if (maxPrice) {
      query = query.lte("price_range_max", parseInt(maxPrice));
    }

    const { data: therapistProfiles, error } = await query;

    if (error) return handleSupabaseError(error);

    // サービス情報の取得
    const therapistIds = therapistProfiles.map(
      (profile: any) => profile.user_id,
    );
    const { data: services, error: servicesError } = await supabase
      .from("therapist_services")
      .select(
        `
        *,
        category:service_categories(id, name)
      `,
      )
      .in("therapist_id", therapistIds)
      .eq("is_active", true);

    if (servicesError) return handleSupabaseError(servicesError);

    // データの整形
    const result = therapistProfiles
      .map((profile: any) => {
        // この療法士のサービスをフィルタリング
        const therapistServices = services.filter(
          (service: any) => service.therapist_id === profile.user_id,
        );

        // カテゴリーフィルターを適用
        if (
          categoryId &&
          !therapistServices.some(
            (service: any) => service.category_id === categoryId,
          )
        ) {
          return null; // このセラピストはカテゴリに一致するサービスを持っていない
        }

        // サービスデータの整形
        const formattedServices = therapistServices.map((service: any) => ({
          id: service.id,
          service_name: service.service_name,
          description: service.description,
          price: service.price,
          currency: service.currency,
          duration: service.duration,
          category_id: service.category_id,
          category_name: service.category?.name,
        }));

        // 返す療法士データ
        return {
          id: profile.id,
          user_id: profile.user_id,
          name: profile.user.name,
          profile_picture: profile.user.profile_picture,
          bio: profile.bio,
          rating: profile.rating,
          experience_years: profile.experience_years,
          location: profile.location,
          languages: profile.languages,
          price_range_min: profile.price_range_min,
          price_range_max: profile.price_range_max,
          currency: profile.currency,
          business_name: profile.business_name,
          status: profile.status,
          services: formattedServices,
        };
      })
      .filter(Boolean); // nullをフィルタリング

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "セラピスト情報の取得中に予期しないエラーが発生しました:",
      error,
    );
    return NextResponse.json(
      {
        error: "予期しないエラーが発生しました",
        details: error instanceof Error ? error.message : "不明なエラー",
      },
      { status: 500 },
    );
  }
}
