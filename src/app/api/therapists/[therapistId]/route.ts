// src/app/api/therapists/[therapistId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TherapistProfile } from "../route";

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

export async function GET(
  request: NextRequest,
  { params }: { params: { therapistId: string } }
) {
  try {
    const therapistId = params.therapistId;
    if (!therapistId) {
      return NextResponse.json(
        { error: "セラピストIDが指定されていません" },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase環境変数が設定されていません" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // まずユーザーIDを取得（therapistIdがuserIdかprofileIdのどちらかに対応するため）
    let userId: string;
    let therapistProfileData: any;

    // therapistIdがprofileIdの場合
    const { data: profileData, error: profileError } = await supabase
      .from("therapist_profiles")
      .select("*")
      .eq("id", therapistId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116: データが見つからない
      return handleSupabaseError(profileError);
    }

    if (profileData) {
      userId = profileData.user_id;
      therapistProfileData = profileData;
    } else {
      // therapistIdがuserIdの場合
      const { data: userData, error: userError } = await supabase
        .from("therapist_profiles")
        .select("*")
        .eq("user_id", therapistId)
        .single();

      if (userError) {
        return handleSupabaseError(userError);
      }

      if (!userData) {
        return NextResponse.json(
          { error: "指定されたIDのセラピストが見つかりません" },
          { status: 404 },
        );
      }

      userId = therapistId;
      therapistProfileData = userData;
    }

    // ユーザー基本情報を取得
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .eq("role", "therapist")
      .single();

    if (userError) {
      return handleSupabaseError(userError);
    }

    // サービス情報を取得
    const { data: servicesData, error: servicesError } = await supabase
      .from("therapist_services")
      .select(
        `
        *,
        category:service_categories(id, name)
      `,
      )
      .eq("therapist_id", userId)
      .eq("is_active", true);

    if (servicesError) {
      return handleSupabaseError(servicesError);
    }

    // メディア情報を取得（画像や動画）
    const { data: mediaData, error: mediaError } = await supabase
      .from("media")
      .select("*")
      .eq("therapist_id", userId)
      .eq("access_level", "public");

    if (mediaError) {
      return handleSupabaseError(mediaError);
    }

    // レビュー情報を取得
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select(
        `
        *,
        guest:users!guest_id(id, name, profile_picture)
      `,
      )
      .eq("therapist_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (reviewsError) {
      return handleSupabaseError(reviewsError);
    }

    // 利用可能時間（availability）を取得
    const { data: availabilityData, error: availabilityError } = await supabase
      .from("therapist_availability")
      .select("*")
      .eq("therapist_id", userId)
      .eq("is_available", true)
      .gte("end_time", new Date().toISOString())
      .order("start_time", { ascending: true })
      .limit(20);

    if (availabilityError) {
      return handleSupabaseError(availabilityError);
    }

    // イベントとプロモーションを取得
    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .eq("therapist_id", userId)
      .eq("is_active", true)
      .gte("end_date", new Date().toISOString())
      .order("start_date", { ascending: true });

    if (eventsError) {
      return handleSupabaseError(eventsError);
    }

    // サービスデータの整形
    const formattedServices = servicesData.map((service) => ({
      id: service.id,
      service_name: service.service_name,
      description: service.description,
      price: service.price,
      currency: service.currency,
      duration: service.duration,
      category_id: service.category_id,
      category_name: service.category?.name,
    }));

    // レビューデータの整形
    const formattedReviews = reviewsData.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      media_urls: review.media_urls,
      guest: {
        id: review.guest.id,
        name: review.guest.name,
        profile_picture: review.guest.profile_picture,
      },
    }));

    // メディアのグループ化
    const profileImages = mediaData.filter((media) => media.is_profile_image);
    const serviceImages = mediaData.filter((media) => media.is_service_image);
    const otherMedia = mediaData.filter(
      (media) => !media.is_profile_image && !media.is_service_image,
    );

    // 最終的なレスポンスデータを構築
    const response = {
      id: therapistProfileData.id,
      user_id: userId,
      name: userData.name,
      email: userData.email,
      phone_number: userData.phone_number,
      profile_picture: userData.profile_picture,
      verified_at: userData.verified_at,
      bio: therapistProfileData.bio,
      experience_years: therapistProfileData.experience_years,
      location: therapistProfileData.location,
      languages: therapistProfileData.languages,
      certifications: therapistProfileData.certifications,
      working_hours: therapistProfileData.working_hours,
      status: therapistProfileData.status,
      last_online_at: therapistProfileData.last_online_at,
      price_range_min: therapistProfileData.price_range_min,
      price_range_max: therapistProfileData.price_range_max,
      currency: therapistProfileData.currency,
      business_name: therapistProfileData.business_name,
      address: therapistProfileData.address,
      rating: therapistProfileData.rating,
      services: formattedServices,
      reviews: formattedReviews,
      availability: availabilityData,
      events: eventsData,
      media: {
        profile: profileImages,
        service: serviceImages,
        other: otherMedia,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "セラピスト詳細の取得中に予期しないエラーが発生しました:",
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
