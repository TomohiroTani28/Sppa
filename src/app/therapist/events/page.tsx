// src/app/(therapist)/events/page.tsx
import dynamic from 'next/dynamic';

const EventsPageClient = dynamic(() => import('@/app/therapist/events/EventsPageClient'), { ssr: false });

export default function EventsPage() {
  return <EventsPageClient />;
}
