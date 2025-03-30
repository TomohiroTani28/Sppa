// src/app/tourist/notifications/components/components/NotificationListStatic.tsx
"use client";

import React from "react";
import { useNotificationsApi } from "@/app/hooks/api/useNotificationsApi";

// Define the Notification interface locally or import from src/types/notification.ts
interface Notification {
  id: string;
  type: string;
  message?: string;
  isRead: boolean;
  createdAt: string; // Adjust type based on actual data (e.g., Date, string)
}

export default function NotificationListStatic() {
  const userId = "00000000-0000-0000-0000-000000000000";

  // 通常フェッチ (react-query)
  const { notifications, isLoading, error, refetch } =
    useNotificationsApi(userId);

  if (isLoading) return <p>Loading notifications...</p>;
  if (error) return <p>Error: {String(error)}</p>;

  return (
    <div>
      <button onClick={() => refetch()} className="mb-4 border p-1 rounded">
        Refetch
      </button>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((item) => (
            <li key={item.id} className="border p-2 rounded-md">
              <p>Type: {item.type}</p>
              <p>Message: {item.message ?? "No message"}</p>
              <p>Read: {item.isRead ? "Yes" : "No"}</p>
              <p>Created at: {new Date(item.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}