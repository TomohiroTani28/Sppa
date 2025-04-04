// src/realtime/useRealtimeFeedUpdates.ts
import { useEffect } from "react";
import { gql, useSubscription } from "@apollo/client";
import { create } from "zustand";

const deduplicatePosts = (posts: Array<any>): Array<any> =>
  posts.filter((post, idx, self) => self.findIndex((p) => p.id === post.id) === idx);

interface FeedState {
  posts: Array<any>;
  updateFeed: (newPosts: FeedState["posts"]) => void;
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

export const useRealtimeFeedUpdates = (selectedTab: "tourist" | "therapist" = "tourist") => {
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const posts = useFeedStore((state) => state.posts);
  const role = selectedTab || "tourist";

  console.log("useRealtimeFeedUpdates - サブスクリプション開始:", {
    selectedTab,
    role,
    timestamp: new Date().toISOString(),
  });

  const { data, error, loading } = useSubscription(FEED_SUBSCRIPTION, {
    variables: { role },
    skip: !role,
    onError: (err) => {
      console.error("サブスクリプションエラー詳細:", {
        message: err.message,
        graphQLErrors: err.graphQLErrors?.map((e) => ({
          message: e.message,
          path: e.path,
        })),
        protocolErrors: err.protocolErrors?.map((e) => ({
          message: e.message,
        })),
        networkError: err.networkError ? err.networkError.message : null,
        timestamp: new Date().toISOString(),
      });
    },
    onData: ({ data }) => {
      console.log("リアルタイムデータ受信:", {
        posts: data?.data?.posts || [],
        timestamp: new Date().toISOString(),
      });
    },
  });

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

  return { feedData: posts, loading, error };
};