// src/app/(common)/therapists/[therapistId]/components/TherapistCard.tsx
"use client";
import Avatar from "@/components/Avatar";
import MediaDisplay from "@/components/MediaDisplay";
import RatingStars from "@/components/RatingStars";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { TherapistAvailability } from "@/types/availability";
import { Therapist } from "@/types/therapist";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

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

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onLike();
  };

  const handleCardClick = () => {
    router.push(`/therapists/${therapist.id}`);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <button
        type="button"
        onClick={handleCardClick}
        className="relative w-full p-0 border-0 bg-transparent text-left"
      >
        <MediaDisplay
          type="photo"
          media={{
            id: "temp-id",
            url: (therapist as any).mediaUrls?.[0] ?? "/fallback.jpg",
            type: "photo",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }}
          aspectRatio="16:9"
          src={(therapist as any).mediaUrls?.[0] ?? "/fallback.jpg"}
        />
        <div className="absolute top-2 left-2 flex items-center bg-white bg-opacity-80 rounded-full px-3 py-1 text-sm">
          <div className="mr-2">
            <Avatar
              imageUrl={therapist.profile_picture ?? "/fallback-avatar.jpg"}
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
              {typeof therapist.location === "string"
                ? therapist.location
                : ((therapist.location as any)?.name ??
                    JSON.stringify(therapist.location))}
            </Text>
          </div>
          <div className="flex flex-wrap gap-1">
            {therapist.languages?.map((lang) => (
              <span
                key={lang}
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
            <Heart className="h-4 w-4 fill-current" />
          </Button>
          <Button size="sm" variant="default">
            Book Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TherapistCard;
