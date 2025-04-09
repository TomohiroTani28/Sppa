// src/app/(common)/chat/components/ChatWindow.tsx
"use client";

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/api/useAuth';
import type { ChatMessage } from '@/types/chat';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

// props を readonly に
interface ChatWindowProps {
  readonly receiverId: string;
}

export default function ChatWindow({ receiverId }: ChatWindowProps) {
  const { t } = useTranslation('common');
  const authState = useAuth(); // useAuth から直接認証状態を取得
  const { messages, loading, error } = useRealtimeChat(receiverId);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // 認証のローディング状態を監視
  useEffect(() => {
    setIsLoadingAuth(authState.loading);
  }, [authState.loading]);

  // ローディング中
  if (isLoadingAuth || loading) return <LoadingSpinner />;

  // エラー時
  if (error) return <p className="text-red-500 text-center">{t('chat.error')}</p>;

  // ユーザーが未認証の場合
  if (!authState.user) return <p className="text-gray-500 text-center">{t('auth.required')}</p>;

  // RealtimeMessage を ChatMessage に整形
  const formattedMessages: ChatMessage[] = messages.map((msg) => ({
    id: msg.id,
    senderId: msg.sender_id,
    receiverId: msg.receiver_id ?? '',
    message: msg.content ?? '',
    timestamp: msg.read_at ?? msg.sent_at ?? '',
    status: 'sent',
  }));

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto">
        {formattedMessages.length === 0 ? (
          <p className="text-gray-500 text-center">{t('chat.noMessages')}</p>
        ) : (
          formattedMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === authState.user?.id}
            />
          ))
        )}
      </div>
      <MessageInput receiverId={receiverId} />
    </div>
  );
}