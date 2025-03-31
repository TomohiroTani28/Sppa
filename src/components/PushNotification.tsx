// src/components/PushNotification.tsx
import { setupPushNotifications } from "@/realtime/notifications-push";
import { useEffect } from "react";

const PushNotification = () => {
  useEffect(() => {
    setupPushNotifications((payload) => {
      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
        });
      }
    });
  }, []);

  return null;
};

export default PushNotification;
