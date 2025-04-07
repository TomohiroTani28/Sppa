"use client";
// src/app/(common)/components/TouristLayout.tsx
import React from "react";
import Navbar from "@/components/ui/Navbar";
import NotificationList from "@/app/(common)/notifications/components/NotificationList";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAuth } from "@/hooks/api/useAuth";

// TouristLayoutのプロパティ
type TouristLayoutProps = {
  children: React.ReactNode;
};

const TouristLayout: React.FC<TouristLayoutProps> = ({ children }) => {
  const { preferences, isLoading: preferencesLoading, error: preferencesError } = useUserPreferences();
  const authState = useAuth(); // useAuthから直接状態を取得

  // 認証またはプリファレンスのローディング中
  if (authState.loading || preferencesLoading) return <div>Loading preferences and authentication...</div>;

  // プリファレンスのエラー処理
  if (preferencesError) return <div>Error loading preferences: {preferencesError}</div>;

  // プリファレンスがない場合
  if (!preferences) {
    return <div>No preferences available.</div>;
  }

  // ユーザーがログインしていない場合
  if (!authState.user) {
    return <div>Please log in to view notifications.</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-4">
        <Navbar />
      </div>
      <div className="flex-1 p-10 bg-white overflow-y-auto">{children}</div>
      <div className="w-96 p-4 bg-gray-100">
        <NotificationList preferences={preferences} userId={authState.user.id} />
      </div>
    </div>
  );
};

export default TouristLayout;