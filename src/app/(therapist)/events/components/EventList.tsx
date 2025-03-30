// src/app/therapist/events/components/EventList.tsx
"use client";
import React from "react";
import { useRealtimeEvents } from "@/app/hooks/realtime/useRealtimeEvents";
import EventCard from "./EventCard";
import { Event } from "@/types/event";

const EventList: React.FC = () => {
  const { events, loading, error } = useRealtimeEvents();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {events.length > 0 ? (
        events.map((event: Event) => <EventCard key={event.id} event={event} />)
      ) : (
        <p>No events available</p>
      )}
    </div>
  );
};

export default EventList;
