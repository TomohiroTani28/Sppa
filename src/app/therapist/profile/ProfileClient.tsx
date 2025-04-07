// src/app/therapist/profile/ProfileClient.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/api/useAuth";
import { useFetchUser } from "@/hooks/api/useFetchUser";
import ProfileView from "@/app/tourist/profile/components/ProfileView";
import ProfileEdit from "@/app/tourist/profile/components/ProfileEdit";
import { Spinner } from "@/components/ui/Spinner";
import BottomNavigation from "@/components/BottomNavigation";

// Define the authentication state type
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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authState, setAuthState] = useState<AuthState | null>(null);

  const { getAuthState } = useAuth();

  // Fetch authentication state only on the client side
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const state = await getAuthState();
        setAuthState(state);
      } catch (error) {
        console.error("Failed to fetch auth state:", error);
        setAuthState(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuthState();
  }, [getAuthState]);

  // Fetch user data based on the authenticated user's ID
  const { user: profileUser, loading: profileLoading, error: profileError } = useFetchUser(
    authState?.user?.id || ""
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !authState?.user) {
      router.push("/login");
    }
  }, [authState, isLoading, router]);

  // Handle loading and error states
  if (isLoading || profileLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <Spinner className="w-8 h-8 text-blue-500" />
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (errorMessage || profileError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-red-500">{errorMessage || `エラーが発生しました: ${profileError}`}</p>
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1">
        <ProfileView userId={authState.user.id} />
      </main>
      <BottomNavigation userType="therapist" />
    </div>
  );
};

export default ProfileClient;