"use client";
// src/app/(therapist)/profile/page.tsx
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/hooks/api/useAuth";
import { useFetchUser } from "@/app/hooks/api/useFetchUser";
import ProfileView from "@/app/tourist/profile/components/ProfileView";
import ProfileEdit from "@/app/tourist/profile/components/ProfileEdit";
import { Spinner } from "@/app/components/ui/Spinner";
import BottomNavigation from "@/app/components/common/BottomNavigation";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // URL パラメーターから userId を取得
  const profileUserId = Array.isArray(params.userId) ? params.userId[0] : params.userId;

  const { user: authUser, loading: authLoading } = useAuth();

  // 有効なユーザーIDを算出（profileUserId があればそちら、なければ認証ユーザーのID）
  const effectiveUserId = profileUserId ?? authUser?.id;

  // effectiveUserId が string であることを保証するために非 null アサーションを使用
  const { user: profileUser, loading: profileLoading, error: profileError } = useFetchUser(effectiveUserId!);

  const [isEditing, setIsEditing] = useState(false);
  const currentUserId = authUser?.id;
  const loading = authLoading || profileLoading;

  useEffect(() => {
    setIsLoading(loading);
    if (profileError) {
      setErrorMessage(`エラーが発生しました: ${profileError}`);
    } else {
      setErrorMessage(null);
    }
    if (!loading && authUser) {
      setIsEditing(currentUserId === (profileUserId ?? currentUserId));
    }
  }, [authUser, currentUserId, profileUserId, loading, profileError]);

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
        <button onClick={() => router.push("/tourist/home")} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          ホームに戻る
        </button>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <Spinner className="w-8 h-8 text-blue-500" />
        <p className="text-gray-500">ログインページへリダイレクトしています...</p>
      </div>
    );
  }

  if (!effectiveUserId) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-red-500">エラー: ユーザー情報が利用できません</p>
        <button onClick={() => router.push("/tourist/home")} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1">
        {isEditing ? <ProfileEdit userId={effectiveUserId} /> : <ProfileView userId={effectiveUserId} />}
      </main>
      <BottomNavigation userType="tourist" />
    </div>
  );
};

export default ProfilePage;
