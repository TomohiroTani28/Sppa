"use client";
// src/realtime/RealtimeMatchList.tsx
import React from "react";
import { Therapist } from "@/types/therapist";
import { TherapistAvailability } from "@/types/availability";
import { Button } from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Avatar from "@/components/Avatar";
import RatingStars from "@/components/RatingStars";
import MediaDisplay from "@/components/MediaDisplay";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation"; // Assuming you're using Next.js

// デフォルト画像URLを定義
const DEFAULT_AVATAR_URL = "/default-avatar.png";

interface TherapistCardProps {
  therapist: Therapist;
  availability: TherapistAvailability | null;
  onLike: () => void;
  onUnlike: () => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({
  therapist,
  availability,
  onLike,
  onUnlike,
}) => {
  const router = useRouter();

  // Fix for complex method warning - Extract handlers to separate functions
  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onLike();
  };

  const handleCardClick = () => {
    // Navigate to therapist detail page
    router.push(`/therapist/${therapist.id}`);
  };

  // Button element handles keyboard events automatically
  // No need for a separate keyboard handler

  // Extract location display logic
  const displayLocation = () => {
    if (typeof therapist.location === "string") {
      return therapist.location;
    }
    return (therapist.location as any)?.name ?? JSON.stringify(therapist.location);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <button
        className="relative cursor-pointer w-full text-left p-0 m-0 bg-transparent border-0"
        onClick={handleCardClick}
        aria-label={`View details for ${therapist.name}`}
      >
        <MediaDisplay
          type="photo"
          src={(therapist as any).mediaUrls?.[0] ?? "/fallback.jpg"}
          media={(therapist as any).mediaUrls?.[0] ?? "/fallback.jpg"}
          aspectRatio="16:9"
        />
        <div className="absolute top-2 left-2 flex items-center bg-white bg-opacity-80 rounded-full px-3 py-1 text-sm">
          <div className="mr-2">
            <Avatar
              imageUrl={therapist.profile_picture ?? DEFAULT_AVATAR_URL}
              alt={therapist.name}
              size="sm"
            />
          </div>
          <Text variant="body" className="font-semibold">
            {therapist.business_name ?? therapist.name}
          </Text>
        </div>
      </button>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <RatingStars rating={(therapist as any).averageRating ?? 0} />
            <Text variant="body" className="text-sm text-gray-700">
              {displayLocation()}
            </Text>
          </div>
          <div className="flex flex-wrap gap-1">
            {therapist.languages?.map((lang, index) => (
              <span
                key={`${lang}-${index}`} // Using a combination of value and index for unique keys
                className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
        <Text variant="body" className="text-sm text-gray-700 line-clamp-2">
          {therapist.bio ?? "自己紹介文が設定されていません。"}
        </Text>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 bg-gray-50 border-t">
        <div className="flex items-center">
          <Text variant="body" className="font-bold mr-2">
            {therapist.price_range_min} - {therapist.price_range_max}{" "}
            {therapist.currency}
          </Text>
        </div>
        <div className="space-x-2">
          <Button
            size="icon"
            variant="outline"
            onClick={handleLike}
            aria-label="Like"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="default"
            onClick={() => router.push(`/booking/${therapist.id}`)}
          >
            Book Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TherapistCard;