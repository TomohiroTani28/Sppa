// src/app/(common)/chat/components/ChatWindow.tsx
"use client";

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/api/useAuth';
import { ChatMessage } from '@/types/chat';
import { useTranslation } from 'next-i18next';
import { useRealtimeChat } from '../../../../hooks/useRealtimeChat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  receiverId: string;
}

export default function ChatWindow({ receiverId }: ChatWindowProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  // ここでは chatRoomId として receiverId を利用（必要に応じて適宜修正）
  const { messages, loading, error } = useRealtimeChat(receiverId);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{t('chat.error')}</p>;

  // RealtimeMessage を ChatMessage に整形
  const formattedMessages: ChatMessage[] = messages.map((msg) => ({
    id: msg.id,
    senderId: msg.sender_id,
    receiverId: msg.receiver_id || '',
    message: msg.content || '',
    timestamp: msg.read_at || msg.sent_at || '',
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
              isOwnMessage={message.senderId === user?.id}
            />
          ))
        )}
      </div>
      {/* receiverId を MessageInput に渡す */}
      <MessageInput receiverId={receiverId} />
    </div>
  );
}
