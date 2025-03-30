// src/app/tourist/components/TouristLayout.tsx
import React from "react";
import Navbar from "@app/components/ui/Navbar";
import NotificationList from "@app/tourist/notifications/components/NotificationList";
import { useUserPreferences } from "@/app/tourist/hooks/useUserPreferences";

// TouristLayoutのプロパティ
type TouristLayoutProps = {
  children: React.ReactNode;
};

const TouristLayout: React.FC<TouristLayoutProps> = ({ children }) => {
  const { preferences, isLoading, error } = useUserPreferences();

  if (isLoading) return <div>Loading preferences...</div>;

  // errorが文字列またはnullであることを前提に処理
  if (error) return <div>Error loading preferences: {error}</div>;

  // preferencesがnullの場合は、フォールバックのUIを表示するか早期リターンする
  if (!preferences) {
    return <div>No preferences available.</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-4">
        <Navbar />
      </div>
      <div className="flex-1 p-10 bg-white overflow-y-auto">{children}</div>
      <div className="w-96 p-4 bg-gray-100">
        <NotificationList preferences={preferences} />
      </div>
    </div>
  );
};

export default TouristLayout;
