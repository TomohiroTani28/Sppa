// src/realtime/availability-listener.ts
import supabase from '@/app/lib/supabase-client';

// リアルタイム変更イベントの型定義
interface AvailabilityChange {
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  data: any; // 将来的には `therapist_availability` テーブルの型に置き換え可能
}

/**
 * セラピストの可用性変更をリアルタイムで購読する関数
 * @param therapistId セラピストのID
 * @param callback 変更イベントを受け取るコールバック関数
 * @returns 購読を解除する関数
 */
export const subscribeToAvailability = (
  therapistId: string,
  callback: (change: AvailabilityChange) => void,
) => {
  // ユニークなチャンネル名を生成
  const channel = supabase
    .channel(`availability_${therapistId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // 挿入、更新、削除のすべてのイベントをリッスン
        schema: 'public',
        table: 'therapist_availability',
        filter: `therapist_id=eq.${therapistId}`, // 指定したセラピストIDにフィルタリング
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