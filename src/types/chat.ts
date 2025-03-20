// src/types/chat.ts
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  translated_content?: { [key: string]: string } | null; // 翻訳データを追加
}

export interface Chat {
  id: string;
  guestId: string;
  therapistId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface RealtimeMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  translated_content?: { [key: string]: string } | null;
  is_read: boolean;
  sent_at: string;
  read_at?: string;
}
