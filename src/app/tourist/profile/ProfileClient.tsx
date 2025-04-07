"use client";
// src/app/tourist/profile/ProfileClient.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/api/useAuth";
import { useFetchUser } from "@/hooks/api/useFetchUser";
import ProfileView from "@/app/tourist/profile/components/ProfileView";
import ProfileEdit from "@/app/tourist/profile/components/ProfileEdit";
import { Spinner } from "@/components/ui/Spinner";
import BottomNavigation from "@/components/BottomNavigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveRedirectPath } from "@/lib/storage-utils";

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
  const profileUserId = useMemo(() => {
    if (!params.userId) return undefined;
    return Array.isArray(params.userId) ? params.userId[0] : params.userId;
  }, [params.userId]);

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

  const {
    user: profileUser,
    loading: profileLoading,
    error: profileError,
  } = profileUserId ? useFetchUser(profileUserId) : { user: null, loading: false, error: null };

  // 認証が完了していなければリダイレクトパスを保存しログインへ
  useEffect(() => {
    if (!authState?.user && !isLoadingAuth) {
      saveRedirectPath(window.location.pathname);
      router.push("/login");
    }
  }, [authState, isLoadingAuth, router]);

  const isLoading = isLoadingAuth || (profileUserId ? profileLoading : false);
  const [hasShownToast, setHasShownToast] = useState(false);

  // エラー処理とプロファイルの有無のチェック
  useEffect(() => {
    if (!isLoading) {
      if (profileError) {
        console.error("Profile error:", profileError);
      } else if (authState?.user && !profileUser && !hasShownToast) {
        setHasShownToast(true);
        toast.error("ユーザーが見つかりませんでした。3秒後にログイン画面に遷移します。", {
          position: "top-center",
          autoClose: 3000,
          onClose: () => router.push("/login"),
        });
      }
    }
  }, [isLoading, authState, profileUser, profileError, hasShownToast, router]);

  // 編集モードの判定（※自身のプロファイルの場合は編集可能）
  const isEditing = useMemo(() => {
    if (!authState?.user) return false;
    return profileUserId ? authState.user.id === profileUserId : true;
  }, [authState, profileUserId]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <Spinner className="w-8 h-8" />
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-red-500">エラーが発生しました: {profileError}</p>
        <button
          onClick={() => router.push("/feed")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  // 有効なユーザーIDがない場合のフォールバック
  const effectiveUserId = (profileUserId || authState?.user?.id) as string;
  if (!effectiveUserId) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-red-500">エラー: ユーザー情報が利用できません</p>
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
        {isEditing ? <ProfileEdit userId={effectiveUserId} /> : <ProfileView userId={effectiveUserId} />}
      </main>
      <BottomNavigation userType="tourist" />
      <ToastContainer />
    </div>
  );
};

export default ProfileClient;