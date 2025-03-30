// src/app/(common)/home/components/FeedList.tsx
'use client';

import { useEffect } from 'react';
import { PostCard } from './PostCard';
import { useFetchEvents } from '@/app/hooks/api/useFetchEvents';
import { useRealtimeAvailability } from '@/app/hooks/api/useRealtimeAvailability';
import { Spinner } from '@/app/components/ui/Spinner';
interface FeedEvent {
  id: string | number;
  therapist_id?: string | number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export default function FeedList() {
  const { events, loading, error } = useFetchEvents();
  const { availabilityMap, subscribeToAvailability } = useRealtimeAvailability();

  useEffect(() => {
    if (events && events.length > 0) {
      events.forEach((event: FeedEvent) => {
        if (event.therapist_id) {
          subscribeToAvailability(String(event.therapist_id));
        }
      });
    }
  }, [events, subscribeToAvailability]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">Failed to load feed.</div>;

  return (
    <div className="space-y-4">
      {events?.map((event: FeedEvent) => {
        // FeedEvent の id と therapist_id を文字列に変換して正規化する
        const normalizedEvent = {
          ...event,
          id: String(event.id),
          therapist_id: event.therapist_id ? String(event.therapist_id) : "",
        };
        return (
          <PostCard
            key={normalizedEvent.id}
            event={normalizedEvent}
            isAvailable={
              event.therapist_id
                ? (availabilityMap[String(event.therapist_id)] ?? false)
                : false
            }
          />
        );
      })}
    </div>
  );
}
