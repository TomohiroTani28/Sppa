// src/app/api/auth/get-jwt/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  console.log("[/api/auth/get-jwt] GET request received");

  const session = await getServerSession(authOptions);
  console.log("[/api/auth/get-jwt] getServerSession result:", session);

  if (!session || !session.user) {
    console.log("[/api/auth/get-jwt] Unauthorized: No session or user");
    return NextResponse.json({ error: "Unauthorized - No session or user" }, { status: 401 });
  }

  const userRole = (session.user as any)?.role || "user";
  console.log("[/api/auth/get-jwt] User role:", userRole);

  try {
    const jwtSecret = process.env.NEXTAUTH_SECRET;
    if (!jwtSecret) {
      console.error("[/api/auth/get-jwt] Error: NEXTAUTH_SECRET is not defined.");
      return NextResponse.json({ error: "Internal Server Error - No secret" }, { status: 500 });
    }

    const hasuraClaims = {
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": userRole,
        "x-hasura-allowed-roles": [userRole],
        "x-hasura-user-id": session.user.id,
      },
    };
    const token = jwt.sign(hasuraClaims, jwtSecret, { algorithm: "HS256" });
    console.log("[/api/auth/get-jwt] Successfully generated JWT.");

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error("[/api/auth/get-jwt] Error generating JWT:", error.message);
    return NextResponse.json({ error: "Internal Server Error - JWT generation failed" }, { status: 500 });
  }
}