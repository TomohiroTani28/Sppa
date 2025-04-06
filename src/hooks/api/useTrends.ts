// src/hooks/api/useTrends.ts
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/api/useAuth';
import { useErrorLogApi } from '@/hooks/api/useErrorLogApi';
import { useActivityLogging } from '@/hooks/api/useActivityLogging';
import { useNotification } from '@/hooks/api/useNotification';

/**
 * GraphQL Queries, Subscriptions, and Mutations
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

export type NotificationType = 'success' | 'error' | 'info';

export interface AuthState {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
  token: string | null;
  role: any;
  profile_picture: string | null;
  loading: boolean;
}

export interface AuthHook {
  getAuthState: () => Promise<AuthState>;
}

/**
 * Helper function to handle errors with reduced arguments
 */
type ErrorHandlerUtils = {
  createErrorLog: (log: any) => void;
  notify: (message: string, type: NotificationType) => void;
  t: (key: string) => string;
};

const handleError = (
  error: Error,
  utils: ErrorHandlerUtils,
  errorType: string
) => {
  const { createErrorLog, notify, t } = utils;
  createErrorLog({
    error_type: errorType,
    message: error.message,
    stack_trace: error.stack,
  });
  notify(t('trends.error'), 'error');
};

/**
 * Data fetching logic
 */
const useTrendData = (auth: AuthHook) => {
  const { data, loading, error } = useQuery(GET_TRENDS, {
    variables: { limit: 10, offset: 0, filters: {} },
    skip: !auth,
  });

  const { data: subscriptionData } = useSubscription(SUBSCRIBE_TREND_UPDATES, {
    variables: { filters: {} },
    skip: !auth,
  });

  const trends = useMemo(
    (): Trend[] => subscriptionData?.trends || data?.trends?.nodes || [],
    [data, subscriptionData]
  );
  const totalCount = useMemo(() => data?.trends?.aggregate?.count || 0, [data]);

  return { trends, totalCount, loading, error };
};

/**
 * Mutation logic with explicit types
 */
const useTrendMutations = (
  notify: (message: string, type: NotificationType) => void,
  createErrorLog: (log: any) => void,
  t: (key: string) => string
) => {
  const [createTrend] = useMutation<{ createTrend: Trend }, { input: TrendInput }>(CREATE_TREND, {
    onCompleted: () => notify(t('trends.created'), 'success'),
    onError: (err) => handleError(err, { createErrorLog, notify, t }, 'TrendCreationError'),
  });

  const [updateTrend] = useMutation<{ updateTrend: Trend }, { id: string; input: TrendInput }>(UPDATE_TREND, {
    onCompleted: () => notify(t('trends.updated'), 'success'),
    onError: (err) => handleError(err, { createErrorLog, notify, t }, 'TrendUpdateError'),
  });

  const [deleteTrend] = useMutation<{ deleteTrend: { id: string } }, { id: string }>(DELETE_TREND, {
    onCompleted: () => notify(t('trends.deleted'), 'success'),
    onError: (err) => handleError(err, { createErrorLog, notify, t }, 'TrendDeletionError'),
  });

  return { createTrend, updateTrend, deleteTrend };
};

/**
 * Handler logic using authState
 */
const useTrendHandlers = (
  authState: AuthState | null,
  mutations: {
    createTrend: (options?: any) => Promise<any>;
    updateTrend: (options?: any) => Promise<any>;
    deleteTrend: (options?: any) => Promise<any>;
  },
  utils: {
    logActivity: (activity: any) => void;
    createErrorLog: (log: any) => void;
    notify: (message: string, type: NotificationType) => void;
    t: (key: string) => string;
  }
) => {
  const { createTrend, updateTrend, deleteTrend } = mutations;
  const { logActivity, createErrorLog, notify, t } = utils;

  const handleCreateTrend = useCallback(
    async (input: TrendInput) => {
      try {
        if (!authState || !authState.user) {
          notify(t('auth.required'), 'error');
          return;
        }
        const trendInput = { ...input, user_id: authState.user.id, post_type: 'trend' };
        await createTrend({ variables: { input: trendInput } });
        logActivity({
          activityType: 'trend_created',
          description: `User ${authState.user.id} created a trend`,
          requestDetails: { input: trendInput },
        });
      } catch (err) {
        handleError(err as Error, { createErrorLog, notify, t }, 'TrendCreationHandlerError');
      }
    },
    [authState, createTrend, logActivity, createErrorLog, notify, t]
  );

  const handleUpdateTrend = useCallback(
    async (id: string, input: TrendInput) => {
      try {
        if (!authState || !authState.user) {
          notify(t('auth.required'), 'error');
          return;
        }
        await updateTrend({ variables: { id, input } });
        logActivity({
          activityType: 'trend_updated',
          description: `User ${authState.user.id} updated trend ${id}`,
          requestDetails: { input },
        });
      } catch (err) {
        handleError(err as Error, { createErrorLog, notify, t }, 'TrendUpdateHandlerError');
      }
    },
    [authState, updateTrend, logActivity, createErrorLog, notify, t]
  );

  const handleDeleteTrend = useCallback(
    async (id: string) => {
      try {
        if (!authState || !authState.user) {
          notify(t('auth.required'), 'error');
          return;
        }
        await deleteTrend({ variables: { id } });
        logActivity({
          activityType: 'trend_deleted',
          description: `User ${authState.user.id} deleted trend ${id}`,
          requestDetails: { id },
        });
      } catch (err) {
        handleError(err as Error, { createErrorLog, notify, t }, 'TrendDeletionHandlerError');
      }
    },
    [authState, deleteTrend, logActivity, createErrorLog, notify, t]
  );

  return { handleCreateTrend, handleUpdateTrend, handleDeleteTrend };
};

/**
 * Custom hook for managing trends
 */
export const useTrends = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const { createErrorLog } = useErrorLogApi();
  const { notify } = useNotification();

  // State to hold the fetched AuthState
  const [authState, setAuthState] = useState<AuthState | null>(null);

  // Fetch AuthState when auth changes
  useEffect(() => {
    const fetchAuthState = async () => {
      const state = await auth.getAuthState();
      setAuthState(state);
    };
    fetchAuthState();
  }, [auth]);

  // Pass authState to useActivityLogging
  const { logActivity } = useActivityLogging(authState);

  const { trends, totalCount, loading, error } = useTrendData(auth);
  const mutations = useTrendMutations(notify, createErrorLog, t);
  const utils = { logActivity, createErrorLog, notify, t };
  const { handleCreateTrend, handleUpdateTrend, handleDeleteTrend } = useTrendHandlers(authState, mutations, utils);

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