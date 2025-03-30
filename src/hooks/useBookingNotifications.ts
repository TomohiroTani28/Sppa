// src/app/tourist/bookings/hooks/useBookingNotifications.ts
import { useQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { GET_NOTIFICATIONS, MARK_NOTIFICATION_AS_READ, ON_NEW_NOTIFICATION } from '@/graphql/queries';

// 通知の型を定義
interface Notification {
  id: string;
  type: string;
  message: string;
  details: any; // 必要に応じて詳細な型に変更可能
  is_read: boolean;
  created_at: string;
}

// GET_NOTIFICATIONS クエリの戻り値の型を定義
interface GetNotificationsData {
  notifications: Notification[];
}

/**
 * 観光客向けの通知を管理するカスタムフック
 * @param userId 現在のユーザーのID（UUID形式）
 * @returns 通知リスト、ローディング状態、エラー、通知を既読にする関数
 */
export const useBookingNotifications = (userId: string) => {
  // 通知リストを取得するクエリ
  const { data, loading, error, subscribeToMore } = useQuery<GetNotificationsData>(GET_NOTIFICATIONS, {
    variables: { userId },
    fetchPolicy: 'cache-and-network', // キャッシュとネットワークの両方を使用
  });

  // 新しい通知をリアルタイムで購読
  useEffect(() => {
    subscribeToMore({
      document: ON_NEW_NOTIFICATION,
      variables: { userId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newNotification = subscriptionData.data.notifications[0];
        // 新しい通知を既存のリストの先頭に追加
        return {
          notifications: [newNotification, ...prev.notifications],
        };
      },
    });
  }, [subscribeToMore, userId]);

  // 通知を既読にするミューテーション
  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);

  /**
   * 特定の通知を既読としてマークする関数
   * @param id 通知のID（UUID形式）
   */
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead({
        variables: { id },
        optimisticResponse: {
          update_notifications_by_pk: {
            id,
            is_read: true,
          },
        },
        update: (cache) => {
          // キャッシュを更新して既読状態を反映
          const existingNotifications = cache.readQuery<GetNotificationsData>({
            query: GET_NOTIFICATIONS,
            variables: { userId },
          });
          if (existingNotifications) {
            const updatedNotifications = existingNotifications.notifications.map((notif: Notification) =>
              notif.id === id ? { ...notif, is_read: true } : notif
            );
            cache.writeQuery({
              query: GET_NOTIFICATIONS,
              variables: { userId },
              data: { notifications: updatedNotifications },
            });
          }
        },
      });
    } catch (err) {
      console.error('通知の既読化に失敗しました:', err);
    }
  };

  return {
    notifications: data?.notifications || [], // 通知リスト
    loading, // ローディング状態
    error, // エラー状態
    handleMarkAsRead, // 既読化関数
  };
};