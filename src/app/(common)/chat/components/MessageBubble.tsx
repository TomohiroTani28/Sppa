// src/app/(common)/chat/components/MessageBubble.tsx
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types/chat';
import { format } from 'date-fns';
import { useAutoTranslation } from '@/hooks/useAutoTranslation';

interface MessageBubbleProps {
  readonly message: ChatMessage;
  readonly isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const { isAutoTranslateEnabled } = useAutoTranslation();
  // translated_content が存在しない場合に備え、message.message を使用
  const displayContent = isAutoTranslateEnabled && message.translated_content?.en
    ? message.translated_content.en
    : message.message;

  return (
    <div
      className={cn(
        'flex mb-4',
        isOwnMessage ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-xs p-3 rounded-lg',
          isOwnMessage
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        )}
      >
        <p>{displayContent}</p>
        <span className="text-xs opacity-75">
          {format(new Date(message.timestamp), 'HH:mm')} {/* sent_at を timestamp に変更 */}
        </span>
      </div>
    </div>
  );
}