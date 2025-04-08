// src/app/api/notifications/unread/route.ts
import { authOptions } from "@/lib/auth";
import { gql, request } from "graphql-request";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Notification type definition
interface Notification {
  id: string;
  type: string;
  message: string;
  details: string | null;
  created_at: string;
}

// Response type definition
interface UnreadNotificationsResponse {
  notifications: Notification[];
}

// Hasura GraphQLエンドポイント（環境変数から取得）
const HASURA_URL = process.env['HASURA_URL'] ?? "http://localhost:8081/v1/graphql";

// 未読通知を取得するGraphQLクエリ
const GET_UNREAD_NOTIFICATIONS = gql`
  query GetUnreadNotifications($userId: uuid!) {
    notifications(
      where: { user_id: { _eq: $userId }, is_read: { _eq: false } }
      order_by: { created_at: desc }
    ) {
      id
      type
      message
      details
      created_at
    }
  }
`;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // セッションが存在しない場合のチェック
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const role = session.user.role ?? "user";

  const headers = {
    "X-Hasura-Role": role,
    "X-Hasura-User-Id": userId,
  };

  try {
    const data = await request<UnreadNotificationsResponse>(
      HASURA_URL,
      GET_UNREAD_NOTIFICATIONS,
      { userId },
      headers
    );
    return NextResponse.json(data.notifications);
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}