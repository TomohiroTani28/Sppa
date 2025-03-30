// src/app/tourist/chat/components/PriorityMessage.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  isRead: boolean;
  isUrgent?: boolean;
  requiresAction?: boolean;
}

interface PriorityMessageProps {
  messages: Message[];
  currentUserId: string;
  therapistId: string;
  onMessageClick: (messageId: string) => void;
}

const PriorityMessage: React.FC<PriorityMessageProps> = ({
  messages,
  currentUserId,
  therapistId,
  onMessageClick,
}) => {
  const { t } = useTranslation();
  const [priorityMessages, setPriorityMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Filter important messages:
    // 1. Unread messages from therapist
    // 2. Urgent messages
    // 3. Messages requiring action
    const important = messages.filter((msg) => {
      // Messages from therapist that are unread
      const isUnreadFromTherapist = msg.senderId === therapistId && !msg.isRead;

      // Urgent messages or messages requiring action
      const isUrgentOrRequiresAction = msg.isUrgent || msg.requiresAction;

      return isUnreadFromTherapist || isUrgentOrRequiresAction;
    });

    // Sort by timestamp (newest first) and take only the top 5
    const sorted = [...important]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);

    setPriorityMessages(sorted);
  }, [messages, therapistId, currentUserId]);

  if (priorityMessages.length === 0) {
    return null;
  }

  return (
    <div className="priority-messages p-3 bg-amber-50 rounded-lg mb-4">
      <h3 className="text-sm font-medium text-amber-800 mb-2">
        {t("Important Messages")}
      </h3>

      <div className="space-y-2">
        {priorityMessages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded-md cursor-pointer text-sm ${
              message.isUrgent
                ? "bg-red-100 border-l-4 border-red-500"
                : "bg-white border border-amber-200 hover:bg-amber-100"
            }`}
            onClick={() => onMessageClick(message.id)}
          >
            {message.isUrgent && (
              <div className="flex items-center text-red-600 mb-1 text-xs font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {t("Urgent")}
              </div>
            )}

            {message.requiresAction && !message.isUrgent && (
              <div className="flex items-center text-amber-600 mb-1 text-xs font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t("Action Required")}
              </div>
            )}

            {!message.isRead &&
              message.senderId === therapistId &&
              !message.isUrgent &&
              !message.requiresAction && (
                <div className="flex items-center text-blue-600 mb-1 text-xs font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {t("New Message")}
                </div>
              )}

            <p className="text-gray-800 line-clamp-2">{message.text}</p>

            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityMessage;
