"use client";
// src/app/(therapist)/dashboard/components/DashboardSummary.tsx
import React, { useEffect, useState } from "react";
import { useTherapistAvailabilityApi } from "@/hooks/api/useTherapistAvailabilityApi";
import { useUser } from "@/hooks/api/useUser";
import { Booking } from "@/types/booking";
import { TherapistAvailabilitySlot } from "@/types/availability"; // 正しい型をインポート

// Props 型の定義
interface DashboardSummaryProps {
  therapistId: string;
  bookings: Booking[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  therapistId,
  bookings,
}) => {
  // useUser に therapistId を渡し、user.id と loading を取得
  const { user, loading: loadingUser, error: userError } = useUser(therapistId);
  const { fetchAvailability } = useTherapistAvailabilityApi(therapistId);

  // 可用性データを管理するためのステート
  const [availability, setAvailability] = useState<TherapistAvailabilitySlot[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState<boolean>(true);
  const [availabilityError, setAvailabilityError] = useState<Error | null>(null);

  // 可用性データを取得
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        setLoadingAvailability(true);
        const response = await fetchAvailability();
        // response.available_slots は TherapistAvailabilitySlot[] 型
        setAvailability(response.available_slots);
      } catch (err) {
        setAvailabilityError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoadingAvailability(false);
      }
    };

    loadAvailability();
  }, [fetchAvailability]);

  // ユーザー情報のローディング中
  if (loadingUser) return <div>Loading user data...</div>;
  if (userError || !user) return <div>Please log in or user data not found.</div>;

  // 可用性情報のローディング中
  if (loadingAvailability) {
    return <div>Loading availability...</div>;
  }

  if (availabilityError) {
    return <div>Error loading availability: {availabilityError.message}</div>;
  }

  // availability のデータ構造に合わせる
  const isAvailable = availability.length > 0;

  return (
    <div className="dashboard-summary p-4 border-b">
      <h2 className="text-xl font-bold">Welcome back, {user.id}!</h2>
      <p className="mt-2">
        Your current status: {isAvailable ? "Online" : "Offline"}
      </p>
      <p className="mt-2">Total Bookings: {bookings.length}</p>
    </div>
  );
};

export default DashboardSummary;