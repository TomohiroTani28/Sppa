// src/app/therapist/events/EventsPageClient.tsx
'use client';

import TherapistLayout from '@/app/therapist/components/TherapistLayout';
import EventCard from '@/app/therapist/events/components/EventCard';
import EventForm from '@/app/therapist/events/components/EventForm';
import { useEventData } from '@/app/therapist/hooks/useEventData';
import { RealtimeEventList } from '@/realtime/RealtimeEventList';
import { Event } from '@/types/event';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const EventsPageClient: React.FC = () => {
  const { status, data: session } = useSession();
  const [showEventForm, setShowEventForm] = useState<boolean>(false);

  const therapistId = session?.user?.id ?? '';
  const shouldSkip = !therapistId;

  const { data, refetch, loading: eventLoading } = useEventData(therapistId);

  useEffect(() => {
    if (!shouldSkip) {
      refetch();
    }
  }, [refetch, shouldSkip]);

  const handleEventFormToggle = () => {
    setShowEventForm((prev) => !prev);
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated' || shouldSkip) {
    return <div className="p-4 text-center">ログインしてください。</div>;
  }

  const events = data?.events ?? [];

  const renderContent = () => {
    if (showEventForm) {
      return <EventForm onClose={handleEventFormToggle} />;
    }

    if (eventLoading) {
      return <LoadingSpinner />;
    }

    return (
      <>
        <RealtimeEventList events={events} onUpdate={refetch} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {events.map((event: Event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </>
    );
  };

  return (
    <TherapistLayout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">イベント管理</h1>
        <button className="btn btn-primary mb-4" onClick={handleEventFormToggle}>
          {showEventForm ? 'イベントリストに戻る' : '新しいイベントを作成'}
        </button>
        {renderContent()}
      </div>
    </TherapistLayout>
  );
};

export default EventsPageClient;
