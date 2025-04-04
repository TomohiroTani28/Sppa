// src/hooks/useNotificationState.ts
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

/**
 * 通知の未読件数とエラーを管理するカスタムフック
 */
export function useNotificationState(
  notifications: any[] | null,
  notificationsLoading: boolean,
  notificationsError: any,
  t: (key: string) => string // ← デフォルト値を削除
) {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!notificationsLoading && notifications) {
      setUnreadCount(notifications.filter((n) => !n.is_read).length);
    }
    if (notificationsError) {
      const errorMsg = t("notifications.fetchError") || "Failed to load notifications";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  }, [notifications, notificationsLoading, notificationsError, t]);

  return { unreadCount, error };
}
