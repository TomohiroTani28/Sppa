// src/hooks/useNotificationCount.ts
import { getGraphqlClient } from '@/lib/apollo-client'; // Import client getter
import { gql, useQuery, useSubscription } from '@apollo/client';
import { useSession } from 'next-auth/react'; // Use useSession for client-side auth state
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

// GraphQL query to fetch initial unread notification count
const GET_UNREAD_NOTIFICATIONS_COUNT = gql`
  query GetUnreadNotificationsCount($userId: UUID!) {
    notifications_aggregate(
      where: { user_id: { _eq: $userId }, is_read: { _eq: false } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

// GraphQL subscription for real-time updates to unread notification count
const SUBSCRIBE_UNREAD_NOTIFICATIONS_COUNT = gql`
  subscription OnUnreadNotificationsCount($userId: UUID!) {
    notifications_aggregate(
      where: { user_id: { _eq: $userId }, is_read: { _eq: false } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

/**
 * Custom hook to fetch and manage the count of unread notifications in real-time.
 * @returns {Object} Object containing unreadCount, loading, and error states.
 */
export const useNotificationCount = () => {
  const { t } = useTranslation('common');
  const { data: session, status: sessionStatus } = useSession(); // Get session and status
  const userId = session?.user?.id;
  const client = getGraphqlClient(); // Get Apollo Client instance

  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Determine if the initial auth check is loading
  const isAuthLoading = sessionStatus === 'loading';

  // Skip query/subscription if not authenticated or auth is still loading
  const skip = !userId || isAuthLoading;

  // Initial fetch of unread notification count
  const { data: initialData, loading: initialLoading, error: initialError } = useQuery(
    GET_UNREAD_NOTIFICATIONS_COUNT,
    {
      variables: { userId },
      skip: skip, // Use combined skip condition
      fetchPolicy: 'network-only',
      client: client, // Pass client instance
    }
  );

  // Real-time subscription to unread notification count
  const { data: subscriptionData, loading: subscriptionLoading, error: subscriptionError } = useSubscription(
    SUBSCRIBE_UNREAD_NOTIFICATIONS_COUNT,
    {
      variables: { userId },
      skip: skip, // Use combined skip condition
      client: client, // Pass client instance
    }
  );

  // Update unread count when initial data is fetched
  useEffect(() => {
    if (!skip && initialData?.notifications_aggregate?.aggregate?.count !== undefined) {
      setUnreadCount(initialData.notifications_aggregate.aggregate.count);
    }
  }, [initialData, skip]);

  // Update unread count when subscription data changes
  useEffect(() => {
    if (!skip && subscriptionData?.notifications_aggregate?.aggregate?.count !== undefined) {
      setUnreadCount(subscriptionData.notifications_aggregate.aggregate.count);
    }
  }, [subscriptionData, skip]);

  // Combine errors
  const error = initialError || subscriptionError
    ? new Error(t('notifications.error.fetch_failed'))
    : null;

  // Combined loading state (auth + query/subscription)
  // Consider if subscriptionLoading should be part of the overall loading state
  const loading = isAuthLoading || (!skip && (initialLoading || subscriptionLoading));

  return {
    unreadCount,
    loading,
    error,
  };
};