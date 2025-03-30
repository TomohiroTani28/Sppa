// src/app/(common)/home/components/MasonryFeed.tsx
"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRealtimeFeedUpdates } from "@/app/hooks/realtime/useRealtimeFeedUpdates";
import { Post } from "@/types/post";
import { LoadingSpinner } from "@/app/components/common/LoadingSpinner";
import { PostCard } from "./PostCard";

interface MasonryFeedProps {
  readonly userId?: string;
  readonly selectedTab: "tourist" | "therapist";
}

export function MasonryFeed({ userId, selectedTab }: MasonryFeedProps) {
  const { t } = useTranslation("common");
  const { feedData, loading, error } = useRealtimeFeedUpdates(selectedTab);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (feedData.length > 0) {
      const mappedPosts: Post[] = feedData.map((item) => ({
        id: item.id,
        userId: item.user_id,
        content: item.content,
        postType: item.post_type,
        location: item.location,
        createdAt: item.created_at,
        media: item.media?.[0]
          ? {
              url: item.media[0].url,
              mediaType: item.media[0].media_type as "photo" | "video",
            }
          : undefined,
        user: {
          id: item.user.id,
          name: item.user.name,
          profilePicture: item.user.profile_picture,
          role: item.user.role as "therapist" | "tourist",
        },
      }));
      setPosts(mappedPosts);
    }
  }, [feedData]);

  if (loading) {
    return <LoadingSpinner aria-label={t("loadingFeed")} />;
  }

  if (error) {
    return <div className="text-red-500">{t("errors.feed_fetch_failed")}</div>;
  }

  if (!posts.length) {
    return <div>{t("noPostsAvailable")}</div>;
  }

  return (
    <div className="masonry-grid px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map((post) => (
        <div key={post.id} className="masonry-item">
          <PostCard post={post} currentUserId={userId} />
        </div>
      ))}
    </div>
  );
}