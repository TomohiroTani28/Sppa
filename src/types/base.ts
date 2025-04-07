// src/types/base.ts

// ユーザー関連の基底型
export interface BaseUser {
  id: string;
  name: string | null;
  email: string | null;
  role: "tourist" | "therapist" | "admin";
  createdAt: string;
  updatedAt: string;
}

// メディア関連の基底型
export interface BaseMedia {
  id: string;
  url: string;
  type: 'photo' | 'video' | 'audio' | 'document';
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    size?: number;
    format?: string;
    filename?: string;
  };
}

// イベント関連の基底型
export interface BaseEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

// 予約関連の基底型
export interface BaseBooking {
  id: string;
  userId: string;
  therapistId: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// レビュー関連の基底型
export interface BaseReview {
  id: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
} 