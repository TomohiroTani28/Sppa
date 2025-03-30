// src/app/tourist/therapists/components/TherapistCard.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Therapist } from "@/types/therapist";
import { TherapistAvailability } from "@/types/availability";
import { Button } from "@app/components/ui/Button";
import Text from "@app/components/ui/Text";
import Avatar from "@app/components/common/Avatar";
import RatingStars from "@app/components/common/RatingStars";
import { MediaDisplay } from "@app/components/common/MediaDisplay";
import { Card, CardContent, CardFooter } from "@app/components/ui/Card";
import { Heart } from "lucide-react";

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

  // 詳細ページへの遷移を実装
  const handleCardClick = () => {
    router.push(`/therapists/${therapist.id}`);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* クリック可能な部分は <button> 要素に置換し、アクセシビリティ対応 */}
      <button
        type="button"
        onClick={handleCardClick}
        className="relative w-full p-0 border-0 bg-transparent text-left"
      >
        <MediaDisplay
          src={(therapist as any).mediaUrls?.[0] ?? "/fallback.jpg"}
          aspectRatio="16:9"
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
            {therapist.business_name || therapist.name}
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
                key={lang} // キーとしてインデックスではなく、言語自体を使用
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
