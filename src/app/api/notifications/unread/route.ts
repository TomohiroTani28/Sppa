// src/app/api/notifications/unread/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { request, gql } from 'graphql-request';

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
const HASURA_URL = process.env.HASURA_URL ?? 'http://localhost:8080/v1/graphql';

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

// Extend NextAuth User type (you should move this to a types file)
declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string; // Add role to the User type
  }

  interface Session {
    user: User;
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Use optional chaining as suggested by SonarLint
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const role = session.user.role ?? 'user'; // Fallback to 'user' if role is undefined

  const headers = {
    'X-Hasura-Role': role,
    'X-Hasura-User-Id': userId,
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
    console.error('Error fetching unread notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}