"use client";
// src/app/(common)/feed/components/MasonryFeed.tsx
import { useTranslation } from "next-i18next";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PostCard } from "./PostCard";
import { Post } from "@/types/post";

interface MasonryFeedProps {
  readonly userId?: string;
  readonly posts: Post[];
}

export function MasonryFeed({ userId, posts }: MasonryFeedProps) {
  const { t } = useTranslation("common");

  if (!posts.length) {
    return <div className="text-center py-4">{t("noPostsAvailable")}</div>;
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
