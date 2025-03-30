"use client";
// src/app/components/common/TherapistAvailabilityPanel.tsx
import { useState, useEffect } from "react";
import { useTherapistAvailabilityApi } from "@/app/hooks/realtime/useTherapistAvailability";
import { FaUserFriends } from "react-icons/fa";

// 表示用にセラピストと空き状況を組み合わせた型
interface DisplayTherapistAvailability {
  id: string;
  name: string;
  status: string;
  next_available: string;
}

// TherapistAvailabilitySlot 型を仮定（実際の型定義に置き換える）
interface TherapistAvailabilitySlot {
  id: string;
  therapist_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export default function TherapistAvailabilityPanel() {
  const [availability, setAvailability] = useState<DisplayTherapistAvailability[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchAvailability, subscribeToAvailability } = useTherapistAvailabilityApi();

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const data = await fetchAvailability();
        const slots: TherapistAvailabilitySlot[] = data.available_slots;

        const mappedData: DisplayTherapistAvailability[] = slots.map((slot) => ({
          id: slot.id,
          name: `セラピスト ${slot.therapist_id}`,
          status: slot.is_available ? "available" : "unavailable",
          next_available: slot.start_time,
        }));

        setAvailability(mappedData);
        setLoading(false);
      } catch (err) {
        setError("データの取得に失敗しました。");
        setLoading(false);
      }
    };

    loadAvailability();

    const unsubscribe = subscribeToAvailability((slots: TherapistAvailabilitySlot[]) => {
      const mappedData: DisplayTherapistAvailability[] = slots.map((slot) => ({
        id: slot.id,
        name: `セラピスト ${slot.therapist_id}`,
        status: slot.is_available ? "available" : "unavailable",
        next_available: slot.start_time,
      }));
      setAvailability(mappedData);
    });

    return () => unsubscribe();
  }, [fetchAvailability, subscribeToAvailability]);

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