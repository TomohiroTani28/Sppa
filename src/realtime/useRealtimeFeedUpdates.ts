// src/realtime/useRealtimeFeedUpdates.ts
import { useAuth } from "@/contexts/AuthContext";
import { POST_FIELDS } from "@/lib/fragments";
import { Post } from "@/types/post";
import { gql, OnDataOptions, useSubscription } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { create } from "zustand";

// 投稿の重複を除去する関数
const deduplicatePosts = (posts: Post[]): Post[] =>
  posts.filter((post, idx, self) => self.findIndex((p) => p.id === post.id) === idx);

// フィードストア（Zustand）
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

// フィードサブスクリプションクエリ（フラグメントを使用）
const FEED_SUBSCRIPTION = gql`
  subscription FeedUpdates($role: String!) {
    posts(
      where: { user: { role: { _eq: $role } } }
      order_by: { created_at: desc }
      limit: 20
    ) {
      ...PostFields
      likes {
        id
        user_id
        post_id
        created_at
      }
      comments {
        id
        content
        user_id
        post_id
        created_at
      }
    }
  }
  ${POST_FIELDS}
`;

// 接続状態型
type ConnectionStatus = 'initializing' | 'connecting' | 'connected' | 'disconnected' | 'error';

interface SubscriptionData {
  posts: Post[];
}

export const useRealtimeFeedUpdates = (
  selectedTab: "tourist" | "therapist" = "tourist",
  initialPosts: Post[] = []
) => {
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const posts = useFeedStore((state) => state.posts);
  const role = selectedTab || "tourist";
  const { user, loading: authLoading } = useAuth();
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('initializing');
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // Base delay in milliseconds

  // 初期データをストアに設定
  useEffect(() => {
    if (initialPosts.length > 0) {
      updateFeed(initialPosts);
    }
  }, [initialPosts, updateFeed]);

  // サブスクリプションエラーハンドラー
  const handleSubscriptionError = useCallback((err: Error) => {
    console.error("[Feed] Subscription error:", err);
    setConnectionStatus('error');
    
    if (err.message.includes("Forbidden") || err.message.includes("Unauthorized")) {
      setSubscriptionError("Authentication error. Please log in again.");
    } else if (err.message.includes("Network")) {
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          setConnectionStatus('connecting');
          setSubscriptionError(null);
        }, RETRY_DELAY * Math.pow(2, retryCount));
      } else {
        setSubscriptionError("Network error. Please check your connection and try again.");
      }
    } else {
      setSubscriptionError(`Subscription error: ${err.message}`);
    }
  }, [retryCount]);

  // サブスクリプションデータハンドラー
  const handleSubscriptionData = useCallback((options: OnDataOptions<SubscriptionData>) => {
    const receivedPosts = options.data?.data?.posts || [];
    setConnectionStatus('connected');
    setRetryCount(0); // Reset retry count on successful data
    updateFeed(receivedPosts);
  }, [updateFeed]);

  // サブスクリプションの設定
  const { error } = useSubscription<SubscriptionData>(FEED_SUBSCRIPTION, {
    variables: { role },
    onData: handleSubscriptionData,
    onError: handleSubscriptionError,
    onComplete: () => setConnectionStatus('disconnected'),
    skip: authLoading,
    shouldResubscribe: true,
    fetchPolicy: 'network-only',
    context: {
      headers: {
        'x-hasura-role': role,
      },
    },
  });

  // 接続状態の更新
  useEffect(() => {
    console.log("[FeedClient] WS Connection Status:", connectionStatus);
  }, [connectionStatus]);

  // リトライロジック
  useEffect(() => {
    if (error && retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`[Feed] Retrying in ${delay}ms (${retryCount + 1}/${MAX_RETRIES})`);
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setConnectionStatus('connecting');
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  return {
    feedData: posts,
    loading: connectionStatus === 'initializing' || connectionStatus === 'connecting',
    error: subscriptionError,
    connectionStatus,
  };
};
