// src/app/therapist/events/EventsPageClient.tsx
'use client';

import TherapistLayout from "@/app/therapist/components/TherapistLayout";
import EventCard from "@/app/therapist/events/components/EventCard";
import EventForm from "@/app/therapist/events/components/EventForm";
import { useEventData } from "@/app/therapist/hooks/useEventData";
import { RealtimeEventList } from "@/realtime/RealtimeEventList";
import { Event } from "@/types/event";
import React, { useEffect, useState } from "react";

const EventsPageClient: React.FC = () => {
  const therapistId = "some-therapist-id";
  const { data, refetch } = useEventData(therapistId);
  const events = data?.events || [];
  const [showEventForm, setShowEventForm] = useState<boolean>(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleEventFormToggle = () => {
    setShowEventForm((prev) => !prev);
  };

  return (
    <TherapistLayout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">イベント管理</h1>
        <button
          className="btn btn-primary mb-4"
          onClick={handleEventFormToggle}
        >
          {showEventForm ? "イベントリストに戻る" : "新しいイベントを作成"}
        </button>

        {showEventForm ? (
          <EventForm onClose={handleEventFormToggle} />
        ) : (
          <div>
            <RealtimeEventList events={events} onUpdate={refetch} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {events.map((event: Event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </TherapistLayout>
  );
};

export default EventsPageClient;
