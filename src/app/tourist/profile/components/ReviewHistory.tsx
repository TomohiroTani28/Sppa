// src/app/tourist/profile/components/ReviewHistory.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/api/useAuth";
import { useFetchUser } from "@/hooks/api/useFetchUser";
import ProfileView from "@/app/tourist/profile/components/ProfileView";
import ProfileEdit from "@/app/tourist/profile/components/ProfileEdit";
import { Spinner } from "@/components/ui/Spinner";
import BottomNavigation from "@/components/BottomNavigation";

// ユーザーIDを決定し、エラーの場合に早期リターンするヘルパー関数
const useEffectiveUserId = () => {
  const router = useRouter();
  const params = useParams();
  const { user: authUser, loading: authLoading } = useAuth();

  // URLパラメーターから userId を取得
  const profileUserId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const effectiveUserId = profileUserId ?? authUser?.id ?? "";

  // ユーザー情報が無い場合は早期リターン用のエラーメッセージを返す
  if (!effectiveUserId && !authLoading) {
    router.push("/tourist/home");
  }
  return { effectiveUserId, authLoading };
};

const ReviewHistory: React.FC = () => {
  const router = useRouter();
  const { effectiveUserId, authLoading } = useEffectiveUserId();
  const { user: authUser } = useAuth();
  const { loading: profileLoading, error: profileError } = useFetchUser(effectiveUserId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const overallLoading = authLoading || profileLoading;
  const currentUserId = authUser?.id ?? "";

  useEffect(() => {
    setIsLoading(overallLoading);
    setErrorMessage(profileError ? `エラーが発生しました: ${profileError}` : null);
  }, [overallLoading, profileError]);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push("/login");
    }
  }, [authUser, authLoading, router]);

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
          onClick={() => router.push("/tourist/home")}
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
