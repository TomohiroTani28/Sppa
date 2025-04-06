// src/app/therapist/events/page.tsx
import { getServerSession } from 'next-auth/next';
import dynamic from 'next/dynamic';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Dynamically import EventsPageClient with SSR disabled
const EventsPageClient = dynamic(() => import('./EventsPageClient'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

// Server component (no 'use client')
export default async function EventsPage() {
  // Fetch session on the server
  const session = await getServerSession(authOptions);
  return <EventsPageClient session={session} />;
}