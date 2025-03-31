// src/app/tourist/bookings/hooks/useMyBookings.ts
import { useQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { GET_MY_BOOKINGS, CANCEL_BOOKING, ON_BOOKING_UPDATE } from '@/graphql/queries';

/**
 * 観光客向けの予約リストを管理するカスタムフック
 * @param userId 現在のユーザーのID（UUID形式）
 * @returns 予約リスト、ローディング状態、エラー、予約キャンセル関数
 */
export const useMyBookings = (userId: string) => {
  // 予約リストを取得するクエリ
  const { data, loading, error, subscribeToMore } = useQuery(GET_MY_BOOKINGS, {
    variables: { guestId: userId },
    fetchPolicy: 'cache-and-network',
  });

  // 予約の更新をリアルタイムで購読
  useEffect(() => {
    subscribeToMore({
      document: ON_BOOKING_UPDATE,
      variables: { guestId: userId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        // サブスクリプションから取得した最新の予約リストで置き換え
        return subscriptionData.data;
      },
    });
  }, [subscribeToMore, userId]);

  // 予約をキャンセルするミューテーション
  const [cancelBooking] = useMutation(CANCEL_BOOKING);

  /**
   * 特定の予約をキャンセルする関数
   * @param id 予約のID（UUID形式）
   */
  const handleCancelBooking = async (id: string) => {
    try {
      await cancelBooking({
        variables: { id },
        optimisticResponse: {
          update_bookings_by_pk: {
            id,
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          },
        },
        // サブスクリプションがキャッシュを更新するため、手動更新は不要
      });
    } catch (err) {
      console.error('予約のキャンセルに失敗しました:', err);
    }
  };

  return {
    bookings: data?.bookings || [],
    loading,
    error,
    handleCancelBooking,
  };
};