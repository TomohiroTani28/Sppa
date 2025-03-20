// src/app/hooks/realtime/useRealtimeFeedUpdates.ts
import { useEffect } from "react";
import { gql, useSubscription } from "@apollo/client";
import { create } from "zustand";

const deduplicatePosts = (posts: Array<any>): Array<any> =>
  posts.filter((post, idx, self) => self.findIndex((p) => p.id === post.id) === idx);

interface FeedState {
  posts: Array<any>;
  updateFeed: (newPosts: FeedState["posts"]) => void;
}

// Zustand ストアの作成
export const useFeedStore = create<FeedState>((set) => ({
  posts: [],
  updateFeed: (newPosts) => {
    set((state) => ({
      posts: deduplicatePosts([...newPosts, ...state.posts]).slice(0, 20),
    }));
  },
}));

// GraphQL サブスクリプションクエリ
const FEED_SUBSCRIPTION = gql`
  subscription FeedUpdates($role: String!) {
    posts(
      where: { user: { role: { _eq: $role } } }
      order_by: { created_at: desc }
      limit: 20
    ) {
      id
      user_id
      content
      post_type
      location
      created_at
      medium {
        id
        url
        media_type
      }
      user {
        id
        name
        profile_picture
        role
      }
    }
  }
`;

/**
 * リアルタイムフィード更新用のカスタムフック
 * @param selectedTab "tourist" | "therapist"
 * @returns { feedData, loading, error }
 */
export const useRealtimeFeedUpdates = (selectedTab: "tourist" | "therapist" = "tourist") => {
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const posts = useFeedStore((state) => state.posts);
  const role = selectedTab || "tourist";

  // デバッグ用ログ
  console.log("useRealtimeFeedUpdates - Selected Tab:", selectedTab);
  console.log("useRealtimeFeedUpdates - Role Value:", role);

  // Apollo Client のサブスクリプションを使用してデータを取得
  const { data, error, loading } = useSubscription(FEED_SUBSCRIPTION, {
    variables: { role },
    skip: !role,
    onError: (err) => {
      console.error("Subscription Error:", {
        message: err.message,
        graphQLErrors: err.graphQLErrors?.map((e) => ({
          message: e.message,
          path: e.path,
        })),
        protocolErrors: err.protocolErrors?.map((e) => ({
          message: e.message,
        })),
        networkError: err.networkError ? err.networkError.message : null,
      });
    },
    onData: ({ data }) => {
      console.log("Realtime Subscription Data:", data?.data?.posts || []);
    },
  });

  // データが更新されたときにフィードを更新
  useEffect(() => {
    if (data?.posts) {
      console.log("Updating feed with new posts:", data.posts);
      updateFeed(data.posts);
    }
    if (error) {
      console.warn("Subscription Failed:", error.message);
    }
  }, [data, error, updateFeed]);

  return { feedData: posts, loading, error };
};
