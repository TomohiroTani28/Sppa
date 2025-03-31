// src/realtime/notifications-listener.ts
import supabase from '@/lib/supabase-client';

// リアルタイム変更イベントの型定義
interface NotificationChange {
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  data: any; // 必要に応じて具体的な型に置き換え可能
}

/**
 * ユーザーの通知変更をリアルタイムで購読する関数
 * @param userId ユーザーのID
 * @param callback 変更イベントを受け取るコールバック関数
 * @returns 購読を解除する関数
 */
export const subscribeToNotifications = (
  userId: string,
  callback: (change: NotificationChange) => void,
) => {
  // ユニークなチャンネル名を生成
  const channel = supabase
    .channel(`notifications_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // 挿入、更新、削除のすべてのイベントをリッスン
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`, // 指定したユーザーIDにフィルタリング
      },
      (payload) => {
        // イベントタイプに応じてコールバックに適切なデータを渡す
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          callback({ event: payload.eventType, data: payload.new });
        } else if (payload.eventType === 'DELETE') {
          callback({ event: 'DELETE', data: payload.old });
        }
      },
    )
    .subscribe();

  // クリーンアップ関数を返す（購読解除用）
  return () => {
    supabase.removeChannel(channel);
  };
};