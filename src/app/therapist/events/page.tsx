// src/app/therapist/events/page.tsx
import { getServerSession } from 'next-auth/next';
import EventsPageWrapper from './EventsPageWrapper';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  return <EventsPageWrapper session={session} />;
}