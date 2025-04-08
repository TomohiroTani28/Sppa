// src/app/(common)/notifications/components/NotificationList.tsx
"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { UserPreferences } from "@/hooks/useUserPreferences";
import { gql, useSubscription } from "@apollo/client";

const NOTIFICATION_SUBSCRIPTION = gql`
  subscription MyNotifications($userId: uuid!) {
    notifications(
      where: { user_id: { _eq: $userId } }
      order_by: { created_at: desc }
    ) {
      id
      type
      message
      is_read
      created_at
    }
  }
`;

interface NotificationListProps {
  preferences: UserPreferences;
  userId?: string; // 👈 userId を受け取るように変更
}

export default function NotificationList({
  preferences,
  userId, // 👈 userId を受け取る
}: NotificationListProps) {
  // preferencesからuserIdを取得する場合を想定（仮実装）
  // const userId = "some-user-id"; // 実際にはpreferencesや別の方法で取得

  const { data, loading } = useSubscription(NOTIFICATION_SUBSCRIPTION, {
    variables: { userId },
  });

  if (loading) return <p>Loading notifications...</p>;

  const notifications = data?.notifications || [];

  return (
    <div className="space-y-4">
      {notifications.map((notif: any) => (
        <Card key={notif.id} className="p-4 flex justify-between items-center">
          <div>
            <p>{notif.message}</p>
            <p className="text-sm text-gray-500">
              {new Date(notif.created_at).toLocaleString()}
            </p>
          </div>
          <Badge variant={notif.is_read ? "default" : "secondary"}>
            {notif.is_read ? "Read" : "Unread"}
          </Badge>
        </Card>
      ))}
    </div>
  );
}