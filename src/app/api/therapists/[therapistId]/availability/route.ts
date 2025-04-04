// src/app/api/therapists/[therapistId]/availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabaseエラーハンドリング関数
function handleSupabaseError(error: any) {
  console.error("Supabase query error:", error);
  return NextResponse.json(
    {
      error: "Failed to fetch availability",
      details: error.message,
      code: error.code || "UNKNOWN_ERROR",
    },
    { status: 500 }
  );
}

// GETハンドラー
export async function GET(
  request: NextRequest,
  context: { params: { therapistId: string } }
) {
  try {
    const therapistId = context.params.therapistId;
    if (!therapistId) {
      return NextResponse.json({ error: "therapistId is missing" }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase environment variables are not set" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // クエリパラメータの取得
    const url = new URL(request.url);
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");

    // ユーザーIDの特定
    let userId: string;

    // therapistIdがプロファイルIDに対応するか確認
    const { data: profileData, error: profileError } = await supabase
      .from("therapist_profiles")
      .select("user_id")
      .eq("id", therapistId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      return handleSupabaseError(profileError);
    }

    if (profileData) {
      userId = profileData.user_id;
    } else {
      // therapistIdがユーザーIDで、かつセラピストロールを持つか確認
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("id", therapistId)
        .eq("role", "therapist")
        .single();

      if (userError) {
        return handleSupabaseError(userError);
      }

      if (!userData) {
        return NextResponse.json({ error: "Therapist not found" }, { status: 404 });
      }

      userId = therapistId;
    }

    // 利用可能時間の取得
    let query = supabase
      .from("therapist_availability")
      .select("*")
      .eq("therapist_id", userId)
      .eq("is_available", true)
      .order("start_time", { ascending: true });

    if (startDate) {
      query = query.gte("start_time", startDate);
    } else {
      query = query.gte("start_time", new Date().toISOString());
    }

    if (endDate) {
      query = query.lte("end_time", endDate);
    }

    const { data: availabilityData, error: availabilityError } = await query;

    if (availabilityError) {
      return handleSupabaseError(availabilityError);
    }

    // 予約済み時間の取得
    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select("start_time, end_time, status")
      .eq("therapist_id", userId)
      .not("status", "in", '("canceled", "completed")')
      .order("start_time", { ascending: true });

    if (bookingsError) {
      return handleSupabaseError(bookingsError);
    }

    // レスポンスの構築
    const response = {
      therapist_id: userId,
      availability: availabilityData,
      bookings: bookingsData,
      recurrence: await getRecurrenceRules(
        supabase,
        availabilityData.map((a: any) => a.id)
      ),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

// POSTハンドラー
export async function POST(
  request: NextRequest,
  context: { params: { therapistId: string } }
) {
  try {
    const therapistId = context.params.therapistId;
    if (!therapistId) {
      return NextResponse.json({ error: "therapistId is missing" }, { status: 400 });
    }

    const data = await request.json();
    const { start_time, end_time, is_available = true, recurrence } = data;

    if (!start_time || !end_time) {
      return NextResponse.json(
        { error: "start_time and end_time are required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase environment variables are not set" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // ユーザーIDの特定
    let userId: string;
    const { data: profileData, error: profileError } = await supabase
      .from("therapist_profiles")
      .select("user_id")
      .eq("id", therapistId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      return handleSupabaseError(profileError);
    }

    if (profileData) {
      userId = profileData.user_id;
    } else {
      userId = therapistId;
    }

    // 新しい利用可能時間の追加
    const { data: newAvailability, error: availabilityError } = await supabase
      .from("therapist_availability")
      .insert({
        therapist_id: userId,
        start_time,
        end_time,
        is_available,
      })
      .select()
      .single();

    if (availabilityError) {
      return handleSupabaseError(availabilityError);
    }

    // 再帰スケジュールの追加（存在する場合）
    let recurrenceData = null;
    if (recurrence) {
      const { data: newRecurrence, error: recurrenceError } = await supabase
        .from("therapist_availability_recurrences")
        .insert({
          availability_id: newAvailability.id,
          recurrence_type: recurrence.type,
          interval: recurrence.interval || 1,
          days_of_week: recurrence.days_of_week,
          end_date: recurrence.end_date,
        })
        .select();

      if (recurrenceError) {
        console.error("Error adding recurrence schedule:", recurrenceError);
      } else {
        recurrenceData = newRecurrence;
      }
    }

    return NextResponse.json({
      ...newAvailability,
      recurrence: recurrenceData,
    });
  } catch (error) {
    console.error("Error adding availability:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

// 再帰ルール取得のヘルパー関数
async function getRecurrenceRules(supabase: any, availabilityIds: string[]) {
  if (!availabilityIds.length) return [];

  const { data, error } = await supabase
    .from("therapist_availability_recurrences")
    .select("*")
    .in("availability_id", availabilityIds);

  if (error) {
    console.error("Error fetching recurrence rules:", error);
    return [];
  }

  return data;
}
