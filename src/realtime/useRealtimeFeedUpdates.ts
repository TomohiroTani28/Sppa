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
      setSubscriptionError("Network error. Please check your connection.");
    } else {
      setSubscriptionError(`Subscription error: ${err.message}`);
    }
  }, []);

  // サブスクリプションデータハンドラー
  const handleSubscriptionData = useCallback((options: OnDataOptions<SubscriptionData>) => {
    const receivedPosts = options.data?.data?.posts || [];
    setConnectionStatus('connected');
    
    console.log("[Feed] Real-time data received:", {
      count: receivedPosts.length,
      firstPostId: receivedPosts[0]?.id,
      timestamp: new Date().toISOString(),
    });
    
    setSubscriptionError(null);
    
    if (receivedPosts.length > 0) {
      updateFeed(receivedPosts);
    }
  }, [updateFeed]);

  // 認証状態に基づいてサブスクリプションをスキップするかどうかを決定
  const shouldSkipSubscription = !user || authLoading;

  // コンポーネントマウント時に接続中ステータスを設定
  useEffect(() => {
    if (!shouldSkipSubscription) {
      setConnectionStatus('connecting');
      console.log("[Feed] Initializing subscription...");
    }
  }, [shouldSkipSubscription]);

  // サブスクリプションフック
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
      console.log(`[Feed] Retrying in ${delay}ms (${retryCount + 1}/${MAX_RETRIES})`);
      
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setConnectionStatus('connecting');
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  // データ更新ハンドラー
  useEffect(() => {
    if (data?.posts) {
      console.log("[Feed] Updating feed data:", {
        count: data.posts.length,
        timestamp: new Date().toISOString(),
      });
      updateFeed(data.posts);
    }
  }, [data, updateFeed]);

  // 認証状態変更時にリセット
  useEffect(() => {
    if (user) {
      setRetryCount(0);
      setSubscriptionError(null);
    }
  }, [user]);

  return { 
    feedData: posts, 
    loading: loading || authLoading, 
    error: subscriptionError ?? error?.message ?? null,
    connectionStatus,
  };
};
