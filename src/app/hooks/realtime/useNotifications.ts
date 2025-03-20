// src/app/hooks/realtime/useNotifications.ts
import { useSubscription, gql } from "@apollo/client";
import { useMemo } from "react";

/**
 * Hasura: notifications テーブルの Subscription
 * user_id が $userId と一致する通知をリアルタイム購読
 */
const NOTIFICATIONS_SUBSCRIPTION = gql`
  subscription Notifications($userId: uuid!) {
    notifications(where: { user_id: { _eq: $userId } }) {
      id
      type
      message
      is_read
      created_at
    }
  }
`;

export interface Notification {
  id: string;
  type: string;
  message?: string | null;
  is_read: boolean;
  created_at: string;
}

/**
 * Hasura Subscriptions を利用して、指定ユーザーIDの通知をリアルタイム購読するフック
 * @param userId ユーザーID (UUID)
 */
export function useNotifications(userId: string | undefined) {
  const skipSubscription = !userId;

  const { data, loading, error } = useSubscription(NOTIFICATIONS_SUBSCRIPTION, {
    variables: { userId },
    skip: skipSubscription,
  });

  const notifications: Notification[] = useMemo(() => {
    if (loading || error || !data) return [];
    return data.notifications as Notification[];
  }, [data, loading, error]);

  return {
    notifications,
    isLoading: loading,
    error,
  };
}