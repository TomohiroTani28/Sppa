// src/realtime/useRealtimeFeedUpdates.ts
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/types/post";
import { gql, OnDataOptions, useSubscription } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { create } from "zustand";

const deduplicatePosts = (posts: Post[]): Post[] =>
  posts.filter((post, idx, self) => self.findIndex((p) => p.id === post.id) === idx);

interface FeedState {
  posts: Post[];
  updateFeed: (newPosts: Post[]) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [],
  updateFeed: (newPosts) => {
    set((state) => ({
      posts: deduplicatePosts([...newPosts, ...state.posts]).slice(0, 20),
    }));
  },
}));

const FEED_SUBSCRIPTION = gql`
  subscription FeedUpdates($role: String!) {
    posts(
      where: { user: { role: { _eq: $role } } }
      order_by: { createdAt: desc }
      limit: 20
    ) {
      id
      userId
      content
      createdAt
      updatedAt
      media {
        url
        mediaType
      }
      user {
        id
        name
        profilePicture
        role
      }
      likes {
        id
        userId
        postId
        createdAt
      }
      comments {
        id
        content
        userId
        postId
        createdAt
      }
    }
  }
`;

interface SubscriptionData {
  posts: Post[];
}

export const useRealtimeFeedUpdates = (selectedTab: "tourist" | "therapist" = "tourist") => {
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const posts = useFeedStore((state) => state.posts);
  const role = selectedTab || "tourist";
  const { user, loading: authLoading } = useAuth();
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // Base delay in milliseconds

  const handleSubscriptionError = useCallback((err: Error) => {
    console.error("Subscription error:", err);
    
    if (err.message.includes("Forbidden") || err.message.includes("Unauthorized")) {
      setSubscriptionError("Authentication error. Please log in again.");
    } else if (err.message.includes("Network")) {
      setSubscriptionError("Network error. Please check your connection.");
    } else {
      setSubscriptionError(`Subscription error: ${err.message}`);
    }
  }, []);

  const handleSubscriptionData = useCallback((options: OnDataOptions<SubscriptionData>) => {
    const posts = options.data?.data?.posts || [];
    console.log("リアルタイムデータ受信:", {
      posts,
      timestamp: new Date().toISOString(),
    });
    setSubscriptionError(null);
  }, []);

  // 認証状態に基づいてサブスクリプションをスキップするかどうかを決定
  const shouldSkipSubscription = !user || authLoading;

  const { data, error, loading } = useSubscription<SubscriptionData>(FEED_SUBSCRIPTION, {
    variables: { role },
    skip: shouldSkipSubscription || !role,
    onError: handleSubscriptionError,
    onData: handleSubscriptionData,
  });

  // エラー発生時のリトライロジック
  useEffect(() => {
    if (error && retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
      const timer = setTimeout(() => {
        console.log(`Retrying subscription (${retryCount + 1}/${MAX_RETRIES})`);
        setRetryCount(prev => prev + 1);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  useEffect(() => {
    if (data?.posts) {
      console.log("フィード更新:", {
        newPosts: data.posts,
        timestamp: new Date().toISOString(),
      });
      updateFeed(data.posts);
    }
    if (error) {
      console.warn("サブスクリプション失敗:", {
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }, [data, error, updateFeed]);

  // 認証状態が変わったときにリトライカウントをリセット
  useEffect(() => {
    if (user) {
      setRetryCount(0);
      setSubscriptionError(null);
    }
  }, [user]);

  return { 
    feedData: posts, 
    loading: loading || authLoading, 
    error: subscriptionError ?? error?.message ?? null 
  };
};