import { getInitialFeedData } from '@/actions/feed-actions';
import { FeedClient } from './FeedClient';

export async function FeedWrapper() {
  const initialPosts = await getInitialFeedData();
  return <FeedClient initialPosts={initialPosts} />;
} 