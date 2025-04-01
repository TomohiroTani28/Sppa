// src/app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHasuraClient } from "@/lib/hasura-client";
import { gql } from "@apollo/client";
import { verifyIdToken } from "@/lib/auth.server";

// GraphQL query to fetch user data
const GET_USER = gql`
  query GetUser($userId: uuid!) {
    users_by_pk(id: $userId) {
      id
      name
      email
      profile_picture
      phone_number
      role
      verified_at
      created_at
      updated_at
      therapist_profiles {
        bio
        experience_years
        languages
        location
        working_hours
        status
        last_online_at
        price_range_min
        price_range_max
        currency
        business_name
        address
        rating
      }
      tourist_profiles {
        nationality
        languages
        interests
        travel_dates
        budget
        preferences
      }
    }
  }
`;

// 機微な情報を隠すかどうかを判断する関数
function shouldHideSensitiveData(
  currentUserRole: string | undefined,
  targetUserRole: string | undefined,
  isOwnProfile: boolean
): boolean {
  return (
    currentUserRole === "tourist" &&
    targetUserRole === "therapist" &&
    !isOwnProfile
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    if (!userId) {
      return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
    }

    // Authorization ヘッダーからトークンを取得
    const token = req.headers.get("Authorization")?.split("Bearer ")[1] ?? "";
    const session = await verifyIdToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // session.id を一旦変数に代入し、存在チェックする
    const sessionUserId = session.id;
    if (!sessionUserId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const client = createHasuraClient(sessionUserId, {});

    // GraphQL クエリ実行
    const { data, errors } = await client.query({
      query: GET_USER,
      variables: { userId },
    });

    if (errors) {
      console.error("GraphQL Errors:", errors);
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }

    if (!data.users_by_pk) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 役割に応じた機微な情報のフィルタリング
    const user = data.users_by_pk;
    const currentUserRole = session.role;
    const isOwnProfile = sessionUserId === userId;

    if (shouldHideSensitiveData(currentUserRole, user.role, isOwnProfile)) {
      delete user.email;
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}