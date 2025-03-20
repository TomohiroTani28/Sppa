// src/app/api/graphql/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const HASURA_GRAPHQL_ENDPOINT =
    process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ||
    "http://localhost:8081/v1/graphql";
  const HASURA_ADMIN_SECRET =
    process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET;

  console.log("Proxying request to:", HASURA_GRAPHQL_ENDPOINT);

  if (!HASURA_ADMIN_SECRET) {
    console.error("Missing HASURA_ADMIN_SECRET in environment variables.");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    console.log("Request body:", body);

    const response = await fetch(HASURA_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Response from Hasura:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Failed to proxy request" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, x-hasura-admin-secret",
    },
  });
}
