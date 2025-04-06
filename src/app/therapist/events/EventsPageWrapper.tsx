'use client';
// src/app/therapist/events/EventsPageWrapper.tsx
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Dynamically import EventsPageClient with SSR disabled
const EventsPageClient = dynamic(() => import('./EventsPageClient'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

interface EventsPageWrapperProps {
  session: any; // Replace 'any' with the proper session type (e.g., from next-auth)
}

export default function EventsPageWrapper({ session }: EventsPageWrapperProps) {
  return <EventsPageClient session={session} />;
}