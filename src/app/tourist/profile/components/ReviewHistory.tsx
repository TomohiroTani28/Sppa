// src/app/tourist/profile/components/ReviewHistory.tsx
"use client";

import ProfileEdit from "@/app/tourist/profile/components/ProfileEdit";
import ProfileView from "@/app/tourist/profile/components/ProfileView";
import BottomNavigation from "@/components/BottomNavigation";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/api/useAuth";
import { useFetchUser } from "@/hooks/api/useFetchUser";
import { AuthState } from "@/types/auth";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// ユーザーIDを決定し、エラーの場合に早期リターンするヘルパー関数
const useEffectiveUserId = () => {
  const router = useRouter();
  const params = useParams();
  const { getAuthState } = useAuth();
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

  // URLパラメーターから userId を取得
  const profileUserId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const effectiveUserId = profileUserId ?? authState?.user?.id ?? "";

  // ユーザー情報が無い場合は早期リターン
  if (!effectiveUserId && !isLoadingAuth) {
    router.push("/feed");
  }
  return { effectiveUserId, authState, isLoadingAuth };
};

const ReviewHistory: React.FC = () => {
  const router = useRouter();
  const { effectiveUserId, authState, isLoadingAuth } = useEffectiveUserId();
  const { loading: profileLoading, error: profileError } = useFetchUser(effectiveUserId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const overallLoading = isLoadingAuth || profileLoading;
  const currentUserId = authState?.user?.id ?? "";

  useEffect(() => {
    setIsLoading(overallLoading);
    setErrorMessage(profileError ? `エラーが発生しました: ${profileError}` : null);
  }, [overallLoading, profileError]);

  useEffect(() => {
    if (!isLoadingAuth && !authState?.user) {
      router.push("/login");
    }
  }, [authState, isLoadingAuth, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <Spinner className="w-8 h-8 text-blue-500" />
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-red-500">{errorMessage}</p>
        <button
          onClick={() => router.push("/feed")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1">
        {currentUserId === effectiveUserId ? (
          <ProfileEdit userId={effectiveUserId} />
        ) : (
          <ProfileView userId={effectiveUserId} />
        )}
      </main>
      <BottomNavigation userType="tourist" />
    </div>
  );
};

export default ReviewHistory;