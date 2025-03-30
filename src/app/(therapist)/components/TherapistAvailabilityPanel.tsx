// src/app/therapist/components/TherapistAvailabilityPanel.tsx
import React, { useState, useEffect } from "react";
import { useTherapistAvailabilityApi } from "@/app/hooks/api/useTherapistAvailabilityApi";
import { TherapistAvailabilitySlot } from "@/types/availability";

interface TherapistAvailabilityPanelProps {
  therapistId: string;
}

export default function TherapistAvailabilityPanel({
  therapistId,
}: TherapistAvailabilityPanelProps) {
  const { fetchAvailability, subscribeToAvailability } = useTherapistAvailabilityApi(therapistId);
  
  const [availability, setAvailability] = useState<TherapistAvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchData = async () => {
      try {
        const result = await fetchAvailability();
        setAvailability(result.available_slots);
      } catch (err) {
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    unsubscribe = subscribeToAvailability((newSlots) => {
      setAvailability(newSlots);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchAvailability, subscribeToAvailability]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!availability.length) return <p>No availability found</p>;

  return (
    <div>
      <h2>Therapist Availability</h2>
      <ul>
        {availability.map((slot) => (
          <li key={slot.id}>
            {slot.start_time} - {slot.end_time}:{" "}
            {slot.is_available ? "Available" : "Booked"}
          </li>
        ))}
      </ul>
    </div>
  );
}
