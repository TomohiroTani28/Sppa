// src/app/(common)/components/TouristLayout.tsx
import React from "react";
import Navbar from "@/components/ui/Navbar";
import NotificationList from "@/app/(common)/notifications/components/NotificationList";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAuth } from "@/hooks/api/useAuth"; // 👈 追加

// TouristLayoutのプロパティ
type TouristLayoutProps = {
  children: React.ReactNode;
};

const TouristLayout: React.FC<TouristLayoutProps> = ({ children }) => {
  const { preferences, isLoading: preferencesLoading, error: preferencesError } = useUserPreferences();
  const { user } = useAuth(); // 👈 追加

  if (preferencesLoading) return <div>Loading preferences...</div>;

  // errorが文字列またはnullであることを前提に処理
  if (preferencesError) return <div>Error loading preferences: {preferencesError}</div>;

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
        {user?.id && <NotificationList preferences={preferences} userId={user.id} />} {/* 👈 userId を props として渡す */}
      </div>
    </div>
  );
};

export default TouristLayout;