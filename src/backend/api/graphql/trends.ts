// src/backend/api/graphql/trends.ts
/**
 * @fileoverview Trends API
 * 
 * このモジュールは、Hasura の GraphQL API を利用して「トレンド」データ（例：最新の投稿とその「いいね」集計）を取得し、
 * リアルタイム更新（Subscription）にも対応するための機能を提供します。
 * 
 * セキュリティ/権限管理は、Cloudflare WAF や Hasura のロールベース認可設定に基づいており、
 * CI/CD は GitHub Actions で自動化される想定です。
 */

import { GraphQLClient, gql } from 'graphql-request';
import { createClient, Client, ClientOptions } from 'graphql-ws';
// i18n 用のテキスト（例：エラーメッセージ）を JSON ファイルから取得
import messages from '@/i18n/messages.json';

interface I18nMessages {
  errors: {
    missingEnvVars: string;
    fetchTrendsError: string;
  };
}

// JSON の内容を I18nMessages 型としてキャスト
const i18nMessages = messages as I18nMessages;

/**
 * TypeScript 型定義
 */
export interface User {
  id: string;
  name: string;
  profile_picture: string | null;
}

export interface Media {
  url: string;
  caption: string | null;
}

export interface Post {
  id: string;
  content: string | null;
  created_at: string;
  user: User;
  media?: Media;
  likeCount: number;
}

export interface TrendsData {
  posts: Post[];
}

/**
 * GraphQL クエリ定義
 * - 最新投稿を取得し、各投稿に対する「いいね」の集計も含めます
 */
const TRENDS_QUERY = gql`
  query Trends($limit: Int!) {
    posts(order_by: { created_at: desc }, limit: $limit) {
      id
      content
      created_at
      user {
        id
        name
        profile_picture
      }
      media {
        url
        caption
      }
      likes_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

/**
 * fetchTrends
 * 
 * Hasura の GraphQL API を利用してトレンド投稿を取得します。
 * エラー発生時は i18n のメッセージを返します。
 * 
 * @param limit 取得する投稿数（デフォルト: 10）
 * @returns Promise<{ data?: TrendsData; error?: string }>
 */
export async function fetchTrends(limit: number = 10): Promise<{ data?: TrendsData; error?: string }> {
  const endpoint = process.env.HASURA_GRAPHQL_ENDPOINT;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;
  if (!endpoint || !adminSecret) {
    return { error: i18nMessages.errors.missingEnvVars || '必要な環境変数が設定されていません' };
  }

  const client = new GraphQLClient(endpoint, {
    headers: {
      'x-hasura-admin-secret': adminSecret,
    },
  });

  try {
    const response = await client.request<{ posts: any[] }>(TRENDS_QUERY, { limit });
    // likes_aggregate を likeCount に変換
    const posts: Post[] = response.posts.map((post: any) => ({
      ...post,
      likeCount: post.likes_aggregate.aggregate.count,
    }));
    return { data: { posts } };
  } catch (error: any) {
    console.error('Error fetching trends:', error);
    return { error: i18nMessages.errors.fetchTrendsError || 'トレンドの取得中にエラーが発生しました' };
  }
}

/**
 * subscribeToTrends
 * 
 * graphql-ws を用いてトレンド投稿のリアルタイム更新をサブスクライブします。
 * 
 * @param onMessage データ受信時のコールバック
 * @param onError エラー発生時のコールバック
 * @param limit 取得する投稿数（デフォルト: 10）
 * @returns Client （subscription のクライアントインスタンス）
 */
export function subscribeToTrends(
  onMessage: (data: TrendsData) => void,
  onError: (error: any) => void,
  limit: number = 10
): Client {
  const wsEndpoint = process.env.HASURA_GRAPHQL_WS_ENDPOINT;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;
  if (!wsEndpoint || !adminSecret) {
    throw new Error(i18nMessages.errors.missingEnvVars || '必要な環境変数が設定されていません');
  }

  const clientOptions: ClientOptions = {
    url: wsEndpoint,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': adminSecret,
      },
    },
  };

  const wsClient = createClient(clientOptions);

  const TRENDS_SUBSCRIPTION = gql`
    subscription Trends($limit: Int!) {
      posts(order_by: { created_at: desc }, limit: $limit) {
        id
        content
        created_at
        user {
          id
          name
          profile_picture
        }
        media {
          url
          caption
        }
        likes_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  `;

  wsClient.subscribe(
    {
      query: TRENDS_SUBSCRIPTION,
      variables: { limit },
    },
    {
      next: (result: any) => {
        if (result.data) {
          const posts: Post[] = result.data.posts.map((post: any) => ({
            ...post,
            likeCount: post.likes_aggregate.aggregate.count,
          }));
          onMessage({ posts });
        }
      },
      error: (err) => {
        console.error('Subscription error:', err);
        onError(err);
      },
      complete: () => console.log('Trends subscription completed'),
    }
  );

  return wsClient;
}
