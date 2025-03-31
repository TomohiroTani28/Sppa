"use client";
// src/components/TherapistAvailabilityPanel.tsx
import { useState, useEffect } from "react";
import { useTherapistAvailability } from '@/realtime/useTherapistAvailability';
import { FaUserFriends } from "react-icons/fa";

// Temporary permissive type to debug
interface TherapistAvailability {
  [key: string]: any; // We'll refine this after logging the data
}

// Display type for therapist availability
interface DisplayTherapistAvailability {
  id: string;
  name: string;
  status: string;
  next_available: string;
}

export default function TherapistAvailabilityPanel({ therapistId }: Readonly<{ therapistId: string }>) {
  const [availability, setAvailability] = useState<DisplayTherapistAvailability[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { availability: therapistAvailability, loading: fetchLoading, error: fetchError } = useTherapistAvailability(therapistId);

  useEffect(() => {
    if (fetchLoading) {
      setLoading(true);
      return;
    }

    if (fetchError) {
      setError("データの取得に失敗しました。");
      setLoading(false);
      return;
    }

    // Log the raw data to inspect its structure
    console.log("Therapist Availability Data:", therapistAvailability);

    // Map the availability data to display format (adjust properties after logging)
    const mappedData: DisplayTherapistAvailability[] = therapistAvailability.map((slot: any) => ({
      id: slot.id || "unknown", // Fallback if id is missing
      name: `セラピスト ${slot.therapist_id || "unknown"}`,
      status: slot.is_available !== undefined ? (slot.is_available ? "available" : "unavailable") : "unknown",
      next_available: slot.start_time || "unknown",
    }));

    setAvailability(mappedData);
    setLoading(false);
  }, [therapistAvailability, fetchLoading, fetchError]);

  if (loading) return <p className="text-muted">読み込み中...</p>;
  if (error) return <p className="text-error">エラー: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {availability.map((therapist) => (
        <div key={therapist.id} className="card p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold text-text flex items-center">
            <FaUserFriends className="mr-2 text-primary" /> {therapist.name}
          </h3>
          <p className="text-text">状況: {therapist.status}</p>
          <p className="text-text">次回の空き: {therapist.next_available}</p>
        </div>
      ))}
    </div>
  );
}