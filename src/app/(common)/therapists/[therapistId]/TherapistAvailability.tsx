// src/app/(common)/therapists/[therapistId]/TherapistAvailability.tsx
"use client";

import { useState, useEffect } from "react";
import { useSubscription } from "@apollo/client";
import { gql } from "@apollo/client";
import { Calendar } from "@/components/ui/Calendar";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

const AVAILABILITY_SUBSCRIPTION = gql`
  subscription TherapistAvailability($therapistId: uuid!) {
    therapist_availability(
      where: {
        therapist_id: { _eq: $therapistId }
        is_available: { _eq: true }
      }
    ) {
      id
      start_time
      end_time
      updated_at
    }
  }
`;

export default function TherapistAvailability({
  therapistId,
}: {
  therapistId: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const { data, loading, error } = useSubscription(AVAILABILITY_SUBSCRIPTION, {
    variables: { therapistId },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Error loading availability: {error.message}</p>;

  const availableSlots = data?.therapist_availability || [];

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Available Slots</h2>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="mb-4"
      />
      <ul className="space-y-2">
        {availableSlots
          .filter((slot: any) => {
            const slotDate = new Date(slot.start_time);
            return (
              selectedDate &&
              slotDate.toDateString() === selectedDate.toDateString()
            );
          })
          .map((slot: any) => (
            <li key={slot.id} className="flex justify-between items-center">
              <span>
                {new Date(slot.start_time).toLocaleTimeString()} -{" "}
                {new Date(slot.end_time).toLocaleTimeString()}
              </span>
              <Button variant="outline" size="sm">
                Book Now
              </Button>
            </li>
          ))}
      </ul>
    </div>
  );
}
