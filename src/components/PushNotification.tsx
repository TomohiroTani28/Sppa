// src/app/components/common/PushNotification.tsx
import { useEffect } from "react";
import { setupPushNotifications } from "@/app/realtime/notifications-push";

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
