// src/app/(common)/chat/components/MessageList.tsx
"use client";

import useRealtimeChat from "@/realtime/useRealtimeChat";
import React, { useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";

// メッセージの型を定義
interface Message {
  text: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

// MessageItem の props の型を定義
interface MessageItemProps {
  index: number;
  style: any;
  data: Message[];
}

// MessageItem コンポーネント
const MessageItem: React.FC<MessageItemProps> = ({ index, style, data }) => {
  const message = data[index];
  
  // messageがundefinedの場合は何も表示しない
  if (!message) {
    return <div style={style} className="message p-2 empty">No message</div>;
  }
  
  return (
    <div style={style} className="message p-2">
      <p>{message.text}</p>
      <small>{new Date(message.timestamp).toLocaleString()}</small>
      {message.mediaUrl && (
        <div>
          {message.mediaType === "image" && <img src={message.mediaUrl} alt="Media" />}
          {message.mediaType === "video" && (
            <video src={message.mediaUrl} controls>
              <track
                kind="captions"
                src="captions.vtt"
                {...{ srclang: "en" } as any}
                label="English"
              />
            </video>
          )}
        </div>
      )}
    </div>
  );
};

// MessageList の props の型を定義
interface MessageListProps {
  chatRoomId: string;
}

// MessageList コンポーネント
const MessageList: React.FC<MessageListProps> = ({ chatRoomId }) => {
  const { messages, loading } = useRealtimeChat(chatRoomId);
  const listRef = useRef<any>(null);

  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToItem(messages.length - 1, "end");
    }
  }, [messages]);

  if (loading) return <div>Loading...</div>;
  
  // メッセージがない場合の処理
  if (messages.length === 0) {
    return <div className="empty-chat">No messages yet</div>;
  }

  return (
    <List
      height={400}
      itemCount={messages.length}
      itemSize={60}
      width="100%"
      ref={listRef}
      itemData={messages}
    >
      {MessageItem}
    </List>
  );
};

export default MessageList;