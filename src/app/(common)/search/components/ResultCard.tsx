// src/app/(common)/search/components/ResultCard.tsx
import { Card, CardContent } from '@/components/ui/Card';
import { TherapistProfile } from '@/types/therapist';
import Avatar from '@/components/Avatar';
import Link from 'next/link';
import RatingStars from '@/components/RatingStars';

interface ResultCardProps {
  readonly therapist: TherapistProfile;
}

export default function ResultCard({ therapist }: ResultCardProps) {
  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/therapists/${therapist.id}`}>
        <CardContent className="flex items-center gap-4">
          <Avatar imageUrl={therapist.user.profile_picture || '/default-avatar.png'} alt={therapist.user.name} size="lg" />
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg">{therapist.user.name}</h3>
            <p className="text-sm text-gray-500">{therapist.bio?.slice(0, 60)}...</p>
            <RatingStars rating={therapist.average_rating?.aggregate?.avg?.rating ?? 4.5} />
            <span className="mt-2 text-xs text-blue-500 capitalize">{therapist.status}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
