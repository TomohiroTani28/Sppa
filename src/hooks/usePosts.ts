// src/hooks/usePosts.ts
import { useQuery, useSubscription } from '@apollo/client';
import { GET_POSTS, ON_NEW_POSTS } from '@/lib/queries/post';

export function usePosts(limit: number = 20, offset: number = 0) {
  const { data, loading, error } = useQuery(GET_POSTS, {
    variables: { limit, offset },
  });
  const { data: subscriptionData } = useSubscription(ON_NEW_POSTS);

  return {
    posts: data?.posts || [],
    newPosts: subscriptionData?.posts || [],
    loading,
    error,
  };
}