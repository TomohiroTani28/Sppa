"use client";
// src/app/(common)/feed/components/MasonryFeed.tsx
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Post } from "@/types/post";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useTranslation } from "next-i18next";
import { useCallback, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { PostCard } from "./PostCard";

interface MasonryFeedProps {
  readonly userId?: string;
  readonly posts: Post[];
  readonly loading?: boolean;
  readonly error?: string | null;
}

export function MasonryFeed({
  userId,
  posts,
  loading = false,
  error = null,
}: MasonryFeedProps) {
  const { t } = useTranslation("common");
  const parentRef = useRef<HTMLDivElement>(null);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
  });

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(posts.length / 2),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300,
    overscan: 5,
  });

  const memoizedPosts = useMemo(() => posts, [posts]);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  if (loading) {
    return <LoadingSpinner aria-label={t("loadingFeed")} />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        <p>{t("errors.feed_fetch_failed")}</p>
        <button
          onClick={handleRefresh}
          className="mt-2 text-primary hover:text-primary/80 transition-colors"
        >
          {t("refresh")}
        </button>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">{t("noPostsAvailable")}</p>
        <button
          onClick={handleRefresh}
          className="mt-2 text-primary hover:text-primary/80 transition-colors"
        >
          {t("refresh")}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-200px)] overflow-auto"
      style={{
        contain: "strict",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * 2;
          const endIndex = Math.min(startIndex + 2, memoizedPosts.length);
          const rowPosts = memoizedPosts.slice(startIndex, endIndex);

          return (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="masonry-grid px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {rowPosts.map((post) => (
                  <div key={post.id} className="masonry-item">
                    <PostCard post={post} currentUserId={userId} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div ref={loadMoreRef} className="h-10" />
    </div>
  );
}
