"use client"; // クライアントサイドでの動作を明示
// src/app/(common)/components/TouristLayout.tsx
import React, { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import NotificationList from "@/app/(common)/notifications/components/NotificationList";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAuth } from "@/hooks/api/useAuth";

// 認証状態の型を定義
interface AuthState {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role?: string } | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

// TouristLayoutのプロパティ
type TouristLayoutProps = {
  children: React.ReactNode;
};

const TouristLayout: React.FC<TouristLayoutProps> = ({ children }) => {
  const { preferences, isLoading: preferencesLoading, error: preferencesError } = useUserPreferences();
  const { getAuthState } = useAuth(); // getAuthState を使用
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // 認証状態を非同期で取得
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const state = await getAuthState();
        setAuthState(state);
      } catch (error) {
        console.error("Failed to fetch auth state:", error);
        setAuthState(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    fetchAuthState();
  }, [getAuthState]);

  // 認証またはプリファレンスのローディング中
  if (isLoadingAuth || preferencesLoading) return <div>Loading preferences and authentication...</div>;

  // プリファレンスのエラー処理
  if (preferencesError) return <div>Error loading preferences: {preferencesError}</div>;

  // プリファレンスがない場合
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
        {authState?.user?.id && (
          <NotificationList preferences={preferences} userId={authState.user.id} /> // authState.user を使用
        )}
      </div>
    </div>
  );
};

export default TouristLayout;