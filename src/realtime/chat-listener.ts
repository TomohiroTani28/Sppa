// src/realtime/chat-listener.ts
import supabase from '@/app/lib/supabase-client';

// リアルタイム変更イベントの型定義
interface ChatMessageChange {
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  data: any; // 将来的には `chat_messages` テーブルの具体的な型に置き換え可能
}

/**
 * チャットメッセージの変更をリアルタイムで購読する関数
 * @param chatRoomId チャットルームのID
 * @param callback 変更イベントを受け取るコールバック関数
 * @returns 購読を解除する関数
 */
export const subscribeToChatMessages = (
  chatRoomId: string,
  callback: (change: ChatMessageChange) => void,
) => {
  // ユニークなチャンネル名を生成
  const channel = supabase
    .channel(`chat_${chatRoomId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // 挿入、更新、削除のすべてのイベントをリッスン
        schema: 'public',
        table: 'chat_messages',
        filter: `chat_room_id=eq.${chatRoomId}`, // 指定したチャットルームIDにフィルタリング
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