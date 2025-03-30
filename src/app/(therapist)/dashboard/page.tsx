"use client";
// src/app/therapist/dashboard/page.tsx
import DashboardSummary from "./components/DashboardSummary";
import BookingSummary from "./components/BookingSummary";
import RevenueChart from "./components/RevenueChart";
import BottomNavigation from "@/app/components/common/BottomNavigation";
import { useRealtimeBookings } from "@/app/hooks/realtime/useRealtimeBookings";
import { useAuth } from "@/hooks/api/useAuth";
import PushNotification from "@/app/components/common/PushNotification";
import { Booking } from "@/types/booking";

export default function DashboardPage() {
  const { user } = useAuth();
  const { realtimeBookings: bookings } = useRealtimeBookings();

  // user が undefined の場合、早期リターン
  if (!user) {
    return <div>ログインしてください。</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-4 pb-16">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Therapist Dashboard
        </h1>
        <DashboardSummary therapistId={user.id} bookings={bookings} />
        <BookingSummary bookings={bookings} />
        <RevenueChart therapistId={user.id} />
      </main>
      <BottomNavigation userType="therapist" />
      <PushNotification />
    </div>
  );
}