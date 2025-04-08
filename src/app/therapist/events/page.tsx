// src/app/therapist/events/page.tsx
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import EventsPageWrapper from './EventsPageWrapper';

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  return <EventsPageWrapper session={session} />;
}