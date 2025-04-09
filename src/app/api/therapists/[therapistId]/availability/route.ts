// src/app/api/therapists/[therapistId]/availability/route.ts
import { graphqlClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from 'next/server';

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
      return NextResponse.json(
        { error: "Therapist ID is required" },
        { status: 400 }
      );
    }

    const client = await graphqlClient();
    const { data, error } = await client.query({
      query: GET_THERAPIST_AVAILABILITY,
      variables: { therapistId },
    });

    if (error) {
      console.error("GraphQL error:", error);
      return NextResponse.json(
        { error: "Failed to fetch therapist availability" },
        { status: 500 }
      );
    }

    return NextResponse.json(data.therapist_availability || []);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ─────────────────────────────────────────────
   POST /api/therapists/[therapistId]/availability
───────────────────────────────────────────── */
export async function POST(
  request: NextRequest,
  context: { params: { therapistId: string } }
): Promise<Response> {
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

// GraphQL query to fetch therapist availability
const GET_THERAPIST_AVAILABILITY = gql`
  query GetTherapistAvailability($therapistId: uuid!) {
    therapist_availability(
      where: { therapist_id: { _eq: $therapistId }, is_available: { _eq: true } }
      order_by: { start_time: asc }
    ) {
      id
      therapist_id
      start_time
      end_time
      is_available
      created_at
      updated_at
    }
  }
`;
