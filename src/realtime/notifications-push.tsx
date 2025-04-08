"use client";
// src/realtime/notifications-push.tsx
import { useToast } from "@/components/ui/Toast";
import supabase from "@/lib/supabase-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect } from "react";

export const NotificationsPush = ({ userId }: { userId: string }) => {
  const { addToast } = useToast(); 

  useEffect(() => {
    let channel: RealtimeChannel | null = null;
    if (supabase) {
      channel = supabase
        .channel(`notifications_${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.new?.['message']) {
              addToast({
                message: payload.new['message'],
                type: "info",
                translate: true,
                duration: 5000,
              });
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, addToast]); 

  return null;
};

// ✅ `setupPushNotifications` をエクスポート (新規追加)
export function setupPushNotifications(callback: (payload: { notification: { title: string; body: string } }) => void) {
  if (typeof window !== "undefined" && "Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("通知が許可されました");
      } else {
        console.warn("通知が許可されていません");
      }
    });
  }

  setTimeout(() => {
    const notificationData = {
      title: "新しい通知",
      body: "これはテスト通知です。",
    };

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notificationData.title, { body: notificationData.body });
    }

    callback({ notification: notificationData });
  }, 3000);
}
