// src/app/api/therapists/[therapistId]/availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ─────────────────────────────────────────────
   共通: Supabase エラーハンドリング
───────────────────────────────────────────── */
function handleSupabaseError(error: any) {
  console.error("Supabase query error:", error);
  return NextResponse.json(
    {
      error: "Supabase query failed",
      details: error.message,
      code: error.code || "UNKNOWN_ERROR",
    },
    { status: 500 },
  );
}

/* ─────────────────────────────────────────────
   GET  /api/therapists/[therapistId]/availability
───────────────────────────────────────────── */
export async function GET(
  request: NextRequest,
  context: { params: { therapistId: string } }
) {
  try {
    const { therapistId } = context.params;
    if (!therapistId) {
      return NextResponse.json({ error: "therapistId is missing" }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase environment variables are not set" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    /* ----- クエリパラメータ ----- */
    const url = new URL(request.url);
    const startDate = url.searchParams.get("start_date");
    const endDate   = url.searchParams.get("end_date");

    /* ----- therapistId → userId 解決 ----- */
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

    /* ----- 利用可能時間の取得 ----- */
    let availabilityQuery = supabase
      .from("therapist_availability")
      .select("*")
      .eq("therapist_id", userId)
      .eq("is_available", true)
      .order("start_time", { ascending: true });

    availabilityQuery = startDate
      ? availabilityQuery.gte("start_time", startDate)
      : availabilityQuery.gte("start_time", new Date().toISOString());

    if (endDate) {
      availabilityQuery = availabilityQuery.lte("end_time", endDate);
    }

    const { data: availabilityData, error: availabilityError } = await availabilityQuery;
    if (availabilityError) {
      return handleSupabaseError(availabilityError);
    }

    /* ----- 予約済み時間の取得 ----- */
    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select("start_time, end_time, status")
      .eq("therapist_id", userId)
      .not("status", "in", '("canceled", "completed")')
      .order("start_time", { ascending: true });

    if (bookingsError) {
      return handleSupabaseError(bookingsError);
    }

    /* ----- レスポンス構築 ----- */
    const response = {
      therapist_id: userId,
      availability: availabilityData,
      bookings: bookingsData,
      recurrence: await getRecurrenceRules(
        supabase,
        availabilityData.map((a: any) => a.id),
      ),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching therapist data:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

/* ─────────────────────────────────────────────
   POST /api/therapists/[therapistId]/availability
───────────────────────────────────────────── */
export async function POST(
  request: NextRequest,
  context: { params: { therapistId: string } }
) {
  try {
    const { therapistId } = context.params;
    if (!therapistId) {
      return NextResponse.json({ error: "therapistId is missing" }, { status: 400 });
    }

    const body = await request.json();
    const { start_time, end_time, is_available = true, recurrence } = body;
    if (!start_time || !end_time) {
      return NextResponse.json(
        { error: "start_time and end_time are required" },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase environment variables are not set" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    /* ----- therapistId → userId 解決 ----- */
    let userId: string;
    const { data: profileData, error: profileError } = await supabase
      .from("therapist_profiles")
      .select("user_id")
      .eq("id", therapistId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      return handleSupabaseError(profileError);
    }
    userId = profileData ? profileData.user_id : therapistId;

    /* ----- 利用可能時間の登録 ----- */
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

    /* ----- 再帰スケジュールの登録（任意） ----- */
    let recurrenceData = null;
    if (recurrence) {
      const { data: newRecurrence, error: recurrenceError } = await supabase
        .from("therapist_availability_recurrences")
        .insert({
          availability_id: newAvailability.id,
          recurrence_type: recurrence.type,
          interval: recurrence.interval ?? 1,
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

    return NextResponse.json({ ...newAvailability, recurrence: recurrenceData });
  } catch (error) {
    console.error("Error adding availability:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

/* ─────────────────────────────────────────────
   Helper: 再帰ルール取得
───────────────────────────────────────────── */
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