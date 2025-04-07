// src/app/(common)/feed/components/FeedList.tsx
'use client';

import { useAuth } from "@/contexts/AuthContext";
import type { Event } from '@/types/event';
import type { Post } from '@/types/post';
import { PostCard } from './PostCard';

interface FeedListProps {
  posts: Post[];
  events: Event[];
  currentUserId?: string;
}

const FeedList: React.FC<FeedListProps> = ({ posts, events, currentUserId }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId ?? ''}
        />
      ))}
    </div>
  );
};

export default FeedList;
