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
const GET_TRENDS = gql`...`;
const SUBSCRIBE_TREND_UPDATES = gql`...`;
const CREATE_TREND = gql`...`;
const UPDATE_TREND = gql`...`;
const DELETE_TREND = gql`...`;

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

// Define our own AuthState to avoid type incompatibility issues
export interface AuthStateUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string; // Removed redundant undefined since ? already implies it
}

export interface LocalAuthState {
  user: AuthStateUser | null;
  // Removed isLoggedIn as it doesn't exist in original AuthState
}

/**
 * Utility: Handle GraphQL or runtime errors
 */
const handleError = (
  error: Error,
  utils: {
    createErrorLog: (log: any) => void;
    notify: (msg: string, type: NotificationType) => void;
    t: (key: string) => string;
  },
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
 * Fetch trend data from GraphQL
 */
const useTrendData = (authLoaded: boolean) => {
  const { data, loading, error } = useQuery(GET_TRENDS, {
    variables: { limit: 10, offset: 0, filters: {} },
    skip: !authLoaded,
  });

  const { data: subscriptionData } = useSubscription(SUBSCRIBE_TREND_UPDATES, {
    variables: { filters: {} },
    skip: !authLoaded,
  });

  const trends = useMemo(() => subscriptionData?.trends ?? data?.trends?.nodes ?? [], [data, subscriptionData]);
  const totalCount = useMemo(() => data?.trends?.aggregate?.count ?? 0, [data]);

  return { trends, totalCount, loading, error };
};

/**
 * CRUD operations for trends
 */
const useTrendMutations = (utils: ReturnType<typeof useUtils>) => {
  const { notify, t } = utils;
  // Removed destructuring of createErrorLog since it's passed via utils to handleError

  const [createTrend] = useMutation(CREATE_TREND, {
    onCompleted: () => notify(t('trends.created'), 'success'),
    onError: (err) => handleError(err, utils, 'TrendCreationError'),
  });

  const [updateTrend] = useMutation(UPDATE_TREND, {
    onCompleted: () => notify(t('trends.updated'), 'success'),
    onError: (err) => handleError(err, utils, 'TrendUpdateError'),
  });

  const [deleteTrend] = useMutation(DELETE_TREND, {
    onCompleted: () => notify(t('trends.deleted'), 'success'),
    onError: (err) => handleError(err, utils, 'TrendDeletionError'),
  });

  return { createTrend, updateTrend, deleteTrend };
};

/**
 * Trend create/update/delete logic using handlers
 */
const useTrendHandlers = (
  authState: LocalAuthState | null, 
  mutations: ReturnType<typeof useTrendMutations>, 
  utils: ReturnType<typeof useUtils>,
  logActivity: (activity: any) => void
) => {
  const { createTrend, updateTrend, deleteTrend } = mutations;
  const { notify, t } = utils;
  
  // Extract common auth check logic to reduce complexity
  const requireAuth = useCallback((callback: Function) => {
    return async (...args: any[]) => {
      if (!authState?.user) {
        notify(t('auth.required'), 'error');
        return;
      }
      return callback(...args);
    };
  }, [authState, notify, t]);
  
  // Handlers with focused implementation after auth check
  const performCreateTrend = useCallback(async (input: TrendInput) => {
    const trendInput = { ...input, user_id: authState!.user!.id, post_type: 'trend' };
    await createTrend({ variables: { input: trendInput } });
    logActivity({ 
      activityType: 'trend_created', 
      description: `User ${authState!.user!.id} created a trend`, 
      requestDetails: { input: trendInput } 
    });
  }, [authState, createTrend, logActivity]);
  
  const performUpdateTrend = useCallback(async (id: string, input: TrendInput) => {
    await updateTrend({ variables: { id, input } });
    logActivity({ 
      activityType: 'trend_updated', 
      description: `User ${authState!.user!.id} updated trend ${id}`, 
      requestDetails: { input } 
    });
  }, [authState, updateTrend, logActivity]);
  
  const performDeleteTrend = useCallback(async (id: string) => {
    await deleteTrend({ variables: { id } });
    logActivity({ 
      activityType: 'trend_deleted', 
      description: `User ${authState!.user!.id} deleted trend ${id}`, 
      requestDetails: { id } 
    });
  }, [authState, deleteTrend, logActivity]);
  
  // Apply auth check to each handler
  return {
    handleCreateTrend: requireAuth(performCreateTrend),
    handleUpdateTrend: requireAuth(performUpdateTrend),
    handleDeleteTrend: requireAuth(performDeleteTrend)
  };
};

/**
 * Utils shared by handlers and mutations
 */
const useUtils = () => {
  const { t } = useTranslation();
  const { createErrorLog } = useErrorLogApi();
  const { notify } = useNotification();
  return { t, createErrorLog, notify };
};

/**
 * Top-level trends hook
 */
export const useTrends = () => {
  const auth = useAuth();
  const [authState, setAuthState] = useState<LocalAuthState | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const fetchAuth = async () => {
      const state = await auth.getAuthState();
      // Convert imported AuthState to our LocalAuthState
      setAuthState(state ? {
        user: state.user ? {
          id: state.user.id,
          name: state.user.name,
          email: state.user.email,
          image: state.user.image,
          role: state.user.role ?? undefined // Using nullish coalescing instead of logical OR
        } : null
      } : null);
      setAuthLoaded(true);
    };
    fetchAuth();
  }, [auth]);

  const { logActivity } = useActivityLogging(authState as any); // Type assertion here is necessary but safer than before
  const utils = useUtils();
  const mutations = useTrendMutations(utils);
  // Pass logActivity as a separate parameter
  const handlers = useTrendHandlers(authState, mutations, utils, logActivity);
  const { trends, totalCount, loading, error } = useTrendData(authLoaded);

  return { trends, totalCount, loading, error, ...handlers };
};