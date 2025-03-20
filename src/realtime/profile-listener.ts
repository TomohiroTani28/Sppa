// src/realtime/profile-listener.ts
import supabase from '@/app/lib/supabase-client';

// リアルタイム変更イベントの型定義
interface ProfileChange {
  event: 'UPDATE';
  data: any; // 必要に応じて具体的な型に置き換え可能
}

/**
 * ユーザーのプロフィール変更をリアルタイムで購読する関数
 * @param userId ユーザーのID
 * @param callback 変更イベントを受け取るコールバック関数
 * @returns 購読を解除する関数
 */
export const subscribeToProfile = (
  userId: string,
  callback: (change: ProfileChange) => void,
) => {
  // ユニークなチャンネル名を生成
  const channel = supabase
    .channel(`profile_${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE', // プロフィールは通常、更新イベントのみを監視
        schema: 'public',
        table: 'profiles',
        filter: `user_id=eq.${userId}`, // 指定したユーザーIDにフィルタリング
      },
      (payload) => {
        // 更新イベントのデータをコールバックに渡す
        callback({ event: 'UPDATE', data: payload.new });
      },
    )
    .subscribe();

  // クリーンアップ関数を返す（購読解除用）
  return () => {
    supabase.removeChannel(channel);
  };
};