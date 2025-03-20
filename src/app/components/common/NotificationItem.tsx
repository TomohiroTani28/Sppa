// src/components/common/NotificationItem.tsx
import React from "react";

interface NotificationItemProps {
  title: string;
  message?: string | null;
  time: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  message,
  time,
}) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
