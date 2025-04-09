// src/app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { gql } from "@apollo/client";
import { verifyIdToken } from "@/lib/token";

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

export async function GET(req: NextRequest) {
  try {
    // ❶ userId を URL パスから取得
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const userId = pathSegments[pathSegments.indexOf("users") + 1];

    if (!userId) {
      return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
    }

    // ❷ 認証トークンを取得・検証
    const token = req.headers.get("Authorization")?.split("Bearer ")[1] ?? "";
    const session = await verifyIdToken(token);
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionUserId = session.id;

    // ❸ Apollo クライアントの設定
    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ?? "http://localhost:8081/v1/graphql",
    });

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
        "x-hasura-role": session.role,
        "x-hasura-user-id": sessionUserId,
      },
    }));

    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });

    // ❹ GraphQL クエリ実行
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

    // ❺ 機密情報のマスキング
    const user = data.users_by_pk;
    const isOwnProfile = sessionUserId === userId;
    if (shouldHideSensitiveData(session.role, user.role, isOwnProfile)) {
      delete user.email;
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
