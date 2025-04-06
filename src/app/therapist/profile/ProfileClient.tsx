// src/app/therapist/profile/ProfileClient.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/api/useAuth";
import { useFetchUser } from "@/hooks/api/useFetchUser";
import ProfileView from "@/app/tourist/profile/components/ProfileView";
import ProfileEdit from "@/app/tourist/profile/components/ProfileEdit";
import { Spinner } from "@/components/ui/Spinner";
import BottomNavigation from "@/components/BottomNavigation";

// 認証状態の型を定義
interface AuthState {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

const ProfileClient: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // URL パラメーターから userId を取得
  const profileUserId = Array.isArray(params.userId) ? params.userId[0] : params.userId;

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

  // 有効なユーザーIDを算出（profileUserId があればそちら、なければ認証ユーザーのID）
  const effectiveUserId = profileUserId ?? authState?.user?.id;

  // effectiveUserId が存在することを確認
  const { user: profileUser, loading: profileLoading, error: profileError } = useFetchUser(effectiveUserId || "");

  const [isEditing, setIsEditing] = useState(false);
  const currentUserId = authState?.user?.id;
  const loading = isLoadingAuth || profileLoading;

  useEffect(() => {
    setIsLoading(loading);
    if (profileError) {
      setErrorMessage(`エラーが発生しました: ${profileError}`);
    } else {
      setErrorMessage(null);
    }
    if (!loading && authState?.user) {
      setIsEditing(currentUserId === (profileUserId ?? currentUserId));
    }
  }, [authState, currentUserId, profileUserId, loading, profileError]);

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
        <button onClick={() => router.push("/feed")} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          ホームに戻る
        </button>
      </div>
    );
  }

  if (!authState?.user) {
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
        <button onClick={() => router.push("/feed")} className="px-4 py-2 bg-blue-500 text-white rounded-md">
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

export default ProfileClient;