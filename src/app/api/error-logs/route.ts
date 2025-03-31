// src/app/hooks/api/error-logs/route.ts
import { NextResponse } from "next/server";
import supabase from "@/lib/supabase-client";
import { ErrorLogCreateInput } from "@/types/error-log";

export async function POST(request: Request) {
  try {
    const errorLogData: ErrorLogCreateInput = await request.json();

    // Insert error log into the database
    const { data, error } = await supabase
      .from("error_logs")
      .insert({
        error_type: errorLogData.error_type,
        message: errorLogData.message,
        stack_trace: errorLogData.stack_trace,
        user_id: errorLogData.user_id || null,
        request_details: errorLogData.request_details || {},
        error_date: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Error inserting error log:", error);
      return NextResponse.json(
        { error: "Failed to create error log" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error processing error log request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
