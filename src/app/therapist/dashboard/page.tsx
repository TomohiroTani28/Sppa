"use client";
// src/app/therapist/dashboard/page.tsx
import DashboardSummary from "./components/DashboardSummary";
import BookingSummary from "./components/BookingSummary";
import RevenueChart from "./components/RevenueChart";
import BottomNavigation from "@/components/BottomNavigation";
import { useRealtimeBookings } from "@/realtime/useRealtimeBookings";
import { useAuth } from "@/hooks/api/useAuth";
import PushNotification from "@/components/PushNotification";
import { Booking } from "@/types/booking";
import { useState, useEffect } from "react";

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

export default function DashboardPage() {
  const { getAuthState } = useAuth(); // getAuthState を使用
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { realtimeBookings: bookings } = useRealtimeBookings();

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

  // 認証状態のローディング中
  if (isLoadingAuth) {
    return <div>Loading authentication...</div>;
  }

  // ユーザーが未認証の場合
  if (!authState?.user) {
    return <div>ログインしてください。</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-4 pb-16">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Therapist Dashboard
        </h1>
        <DashboardSummary therapistId={authState.user.id} bookings={bookings} />
        <BookingSummary bookings={bookings} />
        <RevenueChart therapistId={authState.user.id} />
      </main>
      <BottomNavigation userType="therapist" />
      <PushNotification />
    </div>
  );
}