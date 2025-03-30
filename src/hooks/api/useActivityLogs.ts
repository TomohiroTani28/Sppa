// src/hooks/api/useActivityLogs.ts
import { useQuery, useSubscription } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { gql } from '@apollo/client';
import type { ActivityLog } from '@/types/activity-log';

// GraphQLクエリ: アクティビティログの取得
const GET_ACTIVITY_LOGS = gql`
  query GetActivityLogs($limit: Int = 10, $offset: Int = 0, $userId: UUID) {
    public_activity_logs(
      limit: $limit
      offset: $offset
      where: { user_id: { _eq: $userId } }
      order_by: { created_at: desc }
    ) {
      id
      user_id
      action
      details
      created_at
    }
  }
`;

// GraphQLサブスクリプション: リアルタイムなアクティビティログの更新
const SUBSCRIBE_ACTIVITY_LOGS = gql`
  subscription OnActivityLogUpdate($userId: UUID) {
    public_activity_logs(
      where: { user_id: { _eq: $userId } }
      order_by: { created_at: desc }
    ) {
      id
      user_id
      action
      details
      created_at
    }
  }
`;

interface UseActivityLogsOptions {
  userId?: string; // 特定のユーザーのログを取得する場合
  limit?: number; // 取得するログの最大数
  offset?: number; // オフセット（ページネーション用）
  skip?: boolean; // クエリ実行をスキップするか
}

/**
 * アクティビティログを取得およびリアルタイム更新するためのカスタムフック
 * @param options - クエリオプション
 * @returns アクティビティログデータと関連ステータス
 */
export const useActivityLogs = ({
  userId,
  limit = 10,
  offset = 0,
  skip = false,
}: UseActivityLogsOptions = {}) => {
  // 初回データ取得用のクエリ
  const { data: queryData, loading: queryLoading, error: queryError, refetch } = useQuery<{
    public_activity_logs: ActivityLog[];
  }>(GET_ACTIVITY_LOGS, {
    variables: { limit, offset, userId },
    skip: skip || !userId, // userIdがない場合やskipがtrueの場合は実行しない
  });

  // リアルタイム更新用のサブスクリプション
  const { data: subscriptionData, loading: subscriptionLoading, error: subscriptionError } =
    useSubscription<{ public_activity_logs: ActivityLog[] }>(SUBSCRIBE_ACTIVITY_LOGS, {
      variables: { userId },
      skip: skip || !userId, // userIdがない場合やskipがtrueの場合はサブスクリプションをスキップ
    });

  // 最新のデータを優先的に使用（サブスクリプションが有効ならそちらを優先）
  const activityLogs = useMemo(() => {
    return (subscriptionData?.public_activity_logs || queryData?.public_activity_logs || []).slice(
      0,
      limit
    );
  }, [queryData, subscriptionData, limit]);

  // データの手動更新用コールバック
  const refreshLogs = useCallback(() => {
    refetch({ limit, offset, userId });
  }, [refetch, limit, offset, userId]);

  // ローディング状態とエラーの統合
  const isLoading = queryLoading || subscriptionLoading;
  const error = queryError || subscriptionError;

  return {
    activityLogs, // アクティビティログのリスト
    isLoading, // データ取得中かどうか
    error, // エラーオブジェクト（存在する場合）
    refreshLogs, // 手動リフレッシュ関数
  };
};