// src/app/therapist/profile/ProfileClient.tsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/api/useAuth";
import { useFetchUser } from "@/hooks/api/useFetchUser";
import ProfileView from "@/app/tourist/profile/components/ProfileView";
import { Spinner } from "@/components/ui/Spinner";
import BottomNavigation from "@/components/BottomNavigation";

const ProfileClient: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading, error: authError } = useAuth();

  // Fetch user data based on the authenticated user's ID
  const { user: profileUser, loading: profileLoading, error: profileError } = useFetchUser(user?.id ?? "");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Handle loading state
  if (authLoading || profileLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <Spinner className="w-8 h-8 text-blue-500" />
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  // Handle error state
  if (authError || profileError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-red-500">{authError || `エラーが発生しました: ${profileError}`}</p>
        <button onClick={() => router.push("/feed")} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          ホームに戻る
        </button>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <Spinner className="w-8 h-8 text-blue-500" />
        <p className="text-gray-500">ログインページへリダイレクトしています...</p>
      </div>
    );
  }

  // Render profile view
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1">
        <ProfileView userId={user.id} />
      </main>
      <BottomNavigation userType="therapist" />
    </div>
  );
};

export default ProfileClient;