"use client";
// src/app/(common)/feed/components/MasonryFeed.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRealtimeFeedUpdates } from "@/realtime/useRealtimeFeedUpdates";
import { Post } from "@/types/post";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PostCard } from "./PostCard";

interface MasonryFeedProps {
  readonly userId?: string;
  readonly selectedTab: "tourist" | "therapist";
  readonly posts: Post[]; // postsプロパティを追加
}

export function MasonryFeed({ userId, selectedTab, posts }: MasonryFeedProps) {
  const { t } = useTranslation("common");
  const { feedData, loading, error } = useRealtimeFeedUpdates(selectedTab);
  const [mappedPosts, setMappedPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (feedData.length > 0) {
      const newPosts: Post[] = feedData.map((item) => ({
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
      setMappedPosts(newPosts);
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