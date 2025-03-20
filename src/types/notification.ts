// notification.ts
export type NotificationType = 'like' | 'match' | 'booking_update' | 'review' | 'payment' | 'promotion';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationInput {
  userId: string;
  type: NotificationType;
  message: string;
  isRead?: boolean;
}

export interface NotificationResponse {
  notification: Notification;
  error?: string;
}
