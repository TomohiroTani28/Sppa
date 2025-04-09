// src/app/therapist/profile/ProfileClient.tsx
"use client";
import ProfileView from "@/app/tourist/profile/components/ProfileView";
import BottomNavigation from "@/components/BottomNavigation";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/api/useAuth";
import { useFetchUser } from "@/hooks/api/useFetchUser";
import { AuthState } from "@/types/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProfileClient: React.FC = () => {
  const router = useRouter();
  const { status, getAuthState } = useAuth();
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Fetch auth state
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

  // Fetch user data based on the authenticated user's ID
  const { user: profileUser, loading: profileLoading, error: profileError } = useFetchUser(authState?.user?.id ?? "");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoadingAuth && !authState?.user) {
      router.push("/login");
    }
  }, [authState, isLoadingAuth, router]);

  // Handle loading state
  if (isLoadingAuth || profileLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <Spinner className="w-8 h-8 text-blue-500" />
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  // Handle error state
  if (profileError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-red-500">{`エラーが発生しました: ${profileError}`}</p>
        <button onClick={() => router.push("/feed")} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          ホームに戻る
        </button>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!authState?.user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-gray-500">ログインが必要です</p>
        <button onClick={() => router.push("/login")} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          ログイン
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <ProfileView userId={authState.user.id} />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ProfileClient;