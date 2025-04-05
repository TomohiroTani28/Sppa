// src/app/therapist/events/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const EventsPageClient = dynamic(() => import('./EventsPageClient'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function EventsPage() {
  return <EventsPageClient />;
}
