// src/hooks/api/useTrends.ts
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/api/useAuth';
import { useErrorLogApi } from '@/hooks/api/useErrorLogApi';
import { useActivityLogging } from '@/hooks/api/useActivityLogging';
import { useNotification } from '@/hooks/api/useNotification'; // Fixed import path

/**
 * GraphQLクエリ: トレンドデータを取得
 */
export const GET_TRENDS = gql`
  query GetTrends($limit: Int, $offset: Int, $filters: jsonb) {
    trends: posts_aggregate(
      where: { post_type: { _eq: "trend" }, _and: $filters }
      limit: $limit
      offset: $offset
    ) {
      nodes {
        id
        user_id
        content
        location
        created_at
        updated_at
        user {
          name
          profile_picture
        }
      }
      aggregate {
        count
      }
    }
  }
`;

/**
 * GraphQLサブスクリプション: トレンドデータのリアルタイム更新を購読
 */
export const SUBSCRIBE_TREND_UPDATES = gql`
  subscription SubscribeTrends($filters: jsonb) {
    trends: posts(
      where: { post_type: { _eq: "trend" }, _and: $filters }
      order_by: { created_at: desc }
    ) {
      id
      user_id
      content
      location
      created_at
      updated_at
      user {
        name
        profile_picture
      }
    }
  }
`;

/**
 * GraphQLミューテーション: 新しいトレンドを作成/更新/削除
 */
export const CREATE_TREND = gql`
  mutation CreateTrend($input: posts_insert_input!) {
    createTrend: insert_posts_one(object: $input) {
      id
      user_id
      content
      location
      created_at
      updated_at
    }
  }
`;

export const UPDATE_TREND = gql`
  mutation UpdateTrend($id: uuid!, $input: posts_set_input!) {
    updateTrend: update_posts_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
      user_id
      content
      location
      created_at
      updated_at
    }
  }
`;

export const DELETE_TREND = gql`
  mutation DeleteTrend($id: uuid!) {
    deleteTrend: delete_posts_by_pk(id: $id) {
      id
    }
  }
`;

/**
 * Type Definitions
 */
export interface Trend {
  id: string;
  user_id: string;
  content: string;
  location?: string;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    profile_picture?: string;
  };
}

export interface TrendInput {
  content: string;
  location?: string;
  post_type?: 'trend';
}

/**
 * Helper function to handle errors
 */
const handleError = (
  error: Error,
  createErrorLog: (log: any) => void,
  notify: (message: string, type: 'success' | 'error' | 'info') => void,
  t: (key: string) => string,
  errorType: string
) => {
  createErrorLog({
    error_type: errorType,
    message: error.message,
    stack_trace: error.stack,
  });
  notify(t('trends.error'), 'error');
};

/**
 * Custom hook for managing trends
 */
export const useTrends = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { createErrorLog } = useErrorLogApi();
  const { logActivity } = useActivityLogging();
  const { notify } = useNotification();

  // Fetch trends
  const { data, loading, error } = useQuery(GET_TRENDS, {
    variables: { limit: 10, offset: 0, filters: {} },
    skip: !user,
  });

  // Subscribe to trend updates
  const { data: subscriptionData } = useSubscription(SUBSCRIBE_TREND_UPDATES, {
    variables: { filters: {} },
    skip: !user,
  });

  // Mutations
  const [createTrend] = useMutation(CREATE_TREND, {
    onCompleted: () => notify(t('trends.created'), 'success'),
    onError: (err) => handleError(err, createErrorLog, notify, t, 'TrendCreationError'),
  });

  const [updateTrend] = useMutation(UPDATE_TREND, {
    onCompleted: () => notify(t('trends.updated'), 'success'),
    onError: (err) => handleError(err, createErrorLog, notify, t, 'TrendUpdateError'),
  });

  const [deleteTrend] = useMutation(DELETE_TREND, {
    onCompleted: () => notify(t('trends.deleted'), 'success'),
    onError: (err) => handleError(err, createErrorLog, notify, t, 'TrendDeletionError'),
  });

  // Memoized data
  const trends = useMemo((): Trend[] => {
    return subscriptionData?.trends || data?.trends?.nodes || [];
  }, [data, subscriptionData]);

  const totalCount = useMemo(() => {
    return data?.trends?.aggregate?.count || 0;
  }, [data]);

  // Handlers
  const handleCreateTrend = useCallback(
    async (input: TrendInput) => {
      if (!user) {
        notify(t('auth.required'), 'error');
        return;
      }
      try {
        const trendInput = { ...input, user_id: user.id, post_type: 'trend' };
        await createTrend({ variables: { input: trendInput } });
        logActivity({
          activityType: 'trend_created',
          description: `User ${user.id} created a trend`,
          requestDetails: { input: trendInput }, // Fixed: object instead of string
        });
      } catch (err) {
        handleError(err as Error, createErrorLog, notify, t, 'TrendCreationHandlerError');
      }
    },
    [createTrend, user, logActivity, createErrorLog, notify, t]
  );

  const handleUpdateTrend = useCallback(
    async (id: string, input: TrendInput) => {
      if (!user) {
        notify(t('auth.required'), 'error');
        return;
      }
      try {
        await updateTrend({ variables: { id, input } });
        logActivity({
          activityType: 'trend_updated',
          description: `User ${user.id} updated trend ${id}`,
          requestDetails: { input }, // Fixed: object instead of string
        });
      } catch (err) {
        handleError(err as Error, createErrorLog, notify, t, 'TrendUpdateHandlerError');
      }
    },
    [updateTrend, user, logActivity, createErrorLog, notify, t]
  );

  const handleDeleteTrend = useCallback(
    async (id: string) => {
      if (!user) {
        notify(t('auth.required'), 'error');
        return;
      }
      try {
        await deleteTrend({ variables: { id } });
        logActivity({
          activityType: 'trend_deleted',
          description: `User ${user.id} deleted trend ${id}`,
          requestDetails: { id }, // Added for consistency
        });
      } catch (err) {
        handleError(err as Error, createErrorLog, notify, t, 'TrendDeletionHandlerError');
      }
    },
    [deleteTrend, user, logActivity, createErrorLog, notify, t]
  );

  return {
    trends,
    totalCount,
    loading,
    error,
    handleCreateTrend,
    handleUpdateTrend,
    handleDeleteTrend,
  };
};