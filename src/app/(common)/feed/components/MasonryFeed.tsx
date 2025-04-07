"use client";
// src/app/(common)/feed/components/MasonryFeed.tsx
import { useAuth } from '@/contexts/AuthContext';
import type { Post } from '@/types/post';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import { PostCard } from './PostCard';

const Masonry = dynamic(() => import('react-masonry-css'), { ssr: false });

interface MasonryFeedProps {
  posts: Post[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1
};

export const MasonryFeed: React.FC<MasonryFeedProps> = ({
  posts,
  hasMore,
  isLoading,
  onLoadMore,
}) => {
  const { user } = useAuth();
  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasMore && !isLoading) {
        onLoadMore();
      }
    },
  });

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={user?.id ?? ''}
          />
        ))}
      </Masonry>
      {(hasMore || isLoading) && (
        <div ref={ref} className="h-10" />
      )}
    </>
  );
};
