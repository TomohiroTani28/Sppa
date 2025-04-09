"use client";
// src/app/therapist/dashboard/page.tsx
import DashboardSummary from "./components/DashboardSummary";
import BookingSummary from "./components/BookingSummary";
import RevenueChart from "./components/RevenueChart";
import BottomNavigation from "@/components/BottomNavigation";
import { useRealtimeBookings } from "@/realtime/useRealtimeBookings";
import { useAuth } from "@/hooks/api/useAuth";
import PushNotification from "@/components/PushNotification";
import { useState, useEffect } from "react";
import { AuthState } from "@/types/auth";

export default function DashboardPage() {
  const { getAuthState } = useAuth();
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { realtimeBookings: bookings } = useRealtimeBookings();

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

  if (isLoadingAuth) return <div>Loading authentication...</div>;
  if (!authState?.user) return <div>ログインしてください。</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <DashboardSummary therapistId={authState.user.id} bookings={bookings} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <BookingSummary bookings={bookings} />
          <RevenueChart therapistId={authState.user.id} />
        </div>
      </div>
      <BottomNavigation />
      <PushNotification />
    </div>
  );
}