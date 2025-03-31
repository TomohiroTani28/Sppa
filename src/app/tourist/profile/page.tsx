"use client";
// src/app/(tourist)/profile/page.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/api/useAuth";
import { useFetchUser } from "@/hooks/api/useFetchUser";
import ProfileView from "@/app/(tourist)/profile/components/ProfileView";
import ProfileEdit from "@/app/(tourist)/profile/components/ProfileEdit";
import { Spinner } from "@/components/ui/Spinner";
import BottomNavigation from "@/components/BottomNavigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveRedirectPath } from "@/lib/storage-utils";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const profileUserId = useMemo(() => {
    if (!params.userId) return undefined;
    return Array.isArray(params.userId) ? params.userId[0] : params.userId;
  }, [params.userId]);

  const { user: authUser, loading: authLoading } = useAuth();
  const {
    user: profileUser,
    loading: profileLoading,
    error: profileError,
  } = profileUserId ? useFetchUser(profileUserId) : { user: null, loading: false, error: null };

  // 認証が完了していなければリダイレクトパスを保存しログインへ
  useEffect(() => {
    if (!authUser && !authLoading) {
      saveRedirectPath(window.location.pathname);
      router.push("/login");
    }
  }, [authUser, authLoading, router]);

  const isLoading = authLoading || (profileUserId ? profileLoading : false);
  const [hasShownToast, setHasShownToast] = useState(false);

  // エラー処理とプロファイルの有無のチェック
  useEffect(() => {
    if (!isLoading) {
      if (profileError) {
        // エラーメッセージは表示用コンポーネントで処理
        console.error("Profile error:", profileError);
      } else if (authUser && !profileUser && !hasShownToast) {
        setHasShownToast(true);
        toast.error("ユーザーが見つかりませんでした。3秒後にログイン画面に遷移します。", {
          position: "top-center",
          autoClose: 3000,
          onClose: () => router.push("/login"),
        });
      }
    }
  }, [isLoading, authUser, profileUser, profileError, hasShownToast, router]);

  // 編集モードの判定（※自身のプロファイルの場合は編集可能）
  const isEditing = useMemo(() => {
    if (!authUser) return false;
    return profileUserId ? authUser.id === profileUserId : true;
  }, [authUser, profileUserId]);

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
          onClick={() => router.push("/tourist/home")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  // 有効なユーザーIDがない場合のフォールバック
  const effectiveUserId = (profileUserId || authUser?.id) as string;
  if (!effectiveUserId) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-red-500">エラー: ユーザー情報が利用できません</p>
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
        {isEditing ? <ProfileEdit userId={effectiveUserId} /> : <ProfileView userId={effectiveUserId} />}
      </main>
      <BottomNavigation userType="tourist" />
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
