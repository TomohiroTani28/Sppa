// src/app/(therapist)/profile/components/AvailabilitySettings.tsx
import React, { useState } from "react";
import { useUpdateAvailability } from "@/hooks/api/availability";
import { TherapistAvailability, TherapistAvailabilitySlot } from "@/types/availability";

const AvailabilitySettings: React.FC<{ therapistId: string }> = ({ therapistId }) => {
  const { updateAvailability, isPending, error } = useUpdateAvailability();
  const [availability, setAvailability] = useState<TherapistAvailability>({
    available_slots: [],
    is_available: true,
  });

  const handleAvailabilityChange = (
    id: string,
    field: keyof TherapistAvailabilitySlot,
    value: string
  ) => {
    setAvailability((prev) => ({
      ...prev,
      available_slots: prev.available_slots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const handleAddAvailability = () => {
    const newSlot: TherapistAvailabilitySlot = {
      id: crypto.randomUUID(),
      therapist_id: therapistId,
      start_time: "",
      end_time: "",
      is_available: true,
    };
    setAvailability((prev) => ({
      ...prev,
      available_slots: [...prev.available_slots, newSlot],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAvailability(therapistId, availability);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">空き状況設定</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {availability.available_slots.map((slot) => (
          <div key={slot.id} className="space-y-2">
            <div className="flex space-x-4">
              <div className="w-1/3">
                <label htmlFor={`day-${slot.id}`} className="block text-sm">
                  曜日
                </label>
                <input
                  type="text"
                  id={`day-${slot.id}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={
                    slot.start_time
                      ? new Date(slot.start_time).toLocaleDateString("ja-JP", {
                          weekday: "long",
                        })
                      : ""
                  }
                  onChange={(e) => {
                    const date = new Date(slot.start_time || Date.now());
                    date.setDate(
                      date.getDate() +
                        (["日", "月", "火", "水", "木", "金", "土"].indexOf(
                          e.target.value
                        ) -
                          date.getDay() +
                          7) %
                          7
                    );
                    handleAvailabilityChange(
                      slot.id,
                      "start_time",
                      date.toISOString()
                    );
                  }}
                  required
                />
              </div>
              <div className="w-1/3">
                <label htmlFor={`startTime-${slot.id}`} className="block text-sm">
                  開始時間
                </label>
                <input
                  type="time"
                  id={`startTime-${slot.id}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={
                    slot.start_time
                      ? new Date(slot.start_time).toLocaleTimeString("ja-JP", {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""
                  }
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    const date = new Date(slot.start_time || Date.now());
                    date.setHours(parseInt(hours), parseInt(minutes));
                    handleAvailabilityChange(
                      slot.id,
                      "start_time",
                      date.toISOString()
                    );
                  }}
                  required
                />
              </div>
              <div className="w-1/3">
                <label htmlFor={`endTime-${slot.id}`} className="block text-sm">
                  終了時間
                </label>
                <input
                  type="time"
                  id={`endTime-${slot.id}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={
                    slot.end_time
                      ? new Date(slot.end_time).toLocaleTimeString("ja-JP", {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""
                  }
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    const date = new Date(slot.end_time || Date.now());
                    date.setHours(parseInt(hours), parseInt(minutes));
                    handleAvailabilityChange(
                      slot.id,
                      "end_time",
                      date.toISOString()
                    );
                  }}
                  required
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="w-full bg-gray-300 py-2 rounded-md"
          onClick={handleAddAvailability}
        >
          空き時間追加
        </button>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
          disabled={isPending}
        >
          {isPending ? "更新中..." : "更新"}
        </button>
      </form>
      {error && <div className="text-red-500 text-sm">{error.message}</div>}
    </div>
  );
};

export default AvailabilitySettings;