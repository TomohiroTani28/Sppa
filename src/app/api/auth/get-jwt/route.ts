// src/app/api/auth/get-jwt/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log("[JWT Endpoint] session:", session);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jwtSecret = process.env.NEXTAUTH_SECRET;
  if (!jwtSecret) {
    console.error("[JWT Endpoint] Missing NEXTAUTH_SECRET");
    return NextResponse.json({ error: "No JWT Secret" }, { status: 500 });
  }

  const token = jwt.sign(
    {
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": session.user.role,
        "x-hasura-allowed-roles": [session.user.role],
        "x-hasura-user-id": session.user.id,
      },
    },
    jwtSecret,
    { algorithm: "HS256" }
  );

  return NextResponse.json({ token });
}
