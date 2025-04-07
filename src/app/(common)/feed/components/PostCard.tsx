// src/app/(common)/feed/components/PostCard.tsx
"use client";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Event } from "@/types/event";
import type { Post } from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";

// Media content component
const MediaContent = ({ 
  media, 
  isLoading, 
  onLoad, 
  onError, 
  t 
}: { 
  media: NonNullable<Post['media']>; 
  isLoading: boolean; 
  onLoad: () => void; 
  onError: () => void; 
  t: (key: string) => string;
}) => {
  if (media.mediaType === "video") {
    return (
      <video
        src={media.url}
        controls
        className={`w-full h-full object-cover ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        aria-label={t("videoContent")}
        onLoadedData={onLoad}
        onError={onError}
      >
        <track kind="captions" src="/captions.vtt" label="English" default />
      </video>
    );
  }

  return (
    <img
      src={media.url}
      alt={t("imageContent")}
      className={`w-full h-full object-cover ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
      loading="lazy"
      onLoad={onLoad}
      onError={onError}
    />
  );
};

// New component for media
const PostMedia = ({ post, t }: { post: Post; t: (key: string) => string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleError = () => {
    setError(t("mediaLoadError"));
    setIsLoading(false);
  };

  if (!post.media) return null;

  return (
    <div className="relative aspect-square">
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      ) : (
        <MediaContent
          media={post.media}
          isLoading={isLoading}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
          t={t}
        />
      )}
      {post.user.role === "therapist" && (
        <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
          {t("therapistBadge")}
        </Badge>
      )}
    </div>
  );
};

// Event card component
const EventCard = ({ event, isAvailable, t }: { event: Event; isAvailable: boolean; t: (key: string) => string }) => {
  const formattedDate = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(event.startDate), {
        addSuffix: true,
        locale: ja,
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return t("dateFormatError");
    }
  }, [event.startDate, t]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{event.title}</h3>
          <Badge className={isAvailable ? "bg-green-500" : "bg-red-500"}>
            {isAvailable ? t("available") : t("unavailable")}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
      </div>

      {event.imageUrl && (
        <div className="relative aspect-square">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-4">
        <p className="text-gray-800 whitespace-pre-wrap">{event.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 text-gray-500"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t("bookNow")}</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main component
interface PostCardProps {
  post?: Post;
  currentUserId?: string;
  event?: Event;
  isAvailable?: boolean;
}

export const PostCard = ({ post, currentUserId, event, isAvailable = false }: PostCardProps) => {
  const { t } = useTranslation("common");

  const formattedDate = useMemo(() => {
    if (!post?.createdAt) return "";
    try {
      return formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: ja,
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return t("dateFormatError");
    }
  }, [post?.createdAt, t]);

  const isLiked = useMemo(() => {
    if (!currentUserId || !post?.likes) return false;
    return post.likes.some((like) => like.userId === currentUserId);
  }, [post?.likes, currentUserId]);

  // If event is provided, render EventCard instead of PostCard
  if (event) {
    return <EventCard event={event} isAvailable={isAvailable} t={t} />;
  }

  // If no post is provided, return null
  if (!post) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar
            src={post.user.profilePicture}
            alt={post.user.name}
            className="w-10 h-10"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </div>

      <PostMedia post={post} t={t} />

      <div className="p-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-1 ${
                isLiked ? "text-red-500" : "text-gray-500"
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>{post.likes.length}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 text-gray-500"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments.length}</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
