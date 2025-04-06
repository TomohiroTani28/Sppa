// src/hooks/useNotificationCount.ts
import { useQuery, useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAuth } from '@/hooks/api/useAuth';

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
  const { t } = useTranslation('common'); // i18n integration
  const { getAuthState } = useAuth(); // Access the getAuthState function
  const [userId, setUserId] = useState<string | null>(null); // Store user ID
  const [authLoading, setAuthLoading] = useState(true); // Track auth loading state
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Fetch auth state and set user ID when the component mounts
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const authState = await getAuthState();
        setUserId(authState.user?.id || null); // Set user ID or null if not authenticated
      } catch (err) {
        console.error('Failed to fetch auth state:', err);
        setUserId(null);
      } finally {
        setAuthLoading(false); // Auth state is resolved
      }
    };

    fetchAuthState();
  }, [getAuthState]);

  // Initial fetch of unread notification count
  const { data: initialData, loading: initialLoading, error: initialError } = useQuery(
    GET_UNREAD_NOTIFICATIONS_COUNT,
    {
      variables: { userId },
      skip: !userId, // Skip query if userId is not available
      fetchPolicy: 'network-only',
    }
  );

  // Real-time subscription to unread notification count
  const { data: subscriptionData, loading: subscriptionLoading } = useSubscription(
    SUBSCRIBE_UNREAD_NOTIFICATIONS_COUNT,
    {
      variables: { userId },
      skip: !userId, // Skip subscription if userId is not available
    }
  );

  // Update unread count when initial data is fetched
  useEffect(() => {
    if (initialData?.notifications_aggregate?.aggregate?.count !== undefined) {
      setUnreadCount(initialData.notifications_aggregate.aggregate.count);
    }
  }, [initialData]);

  // Update unread count when subscription data changes
  useEffect(() => {
    if (subscriptionData?.notifications_aggregate?.aggregate?.count !== undefined) {
      setUnreadCount(subscriptionData.notifications_aggregate.aggregate.count);
    }
  }, [subscriptionData]);

  // Handle errors gracefully
  const error = initialError
    ? new Error(t('notifications.error.fetch_failed'))
    : null;

  // Combined loading state (auth + query/subscription)
  const loading = authLoading || initialLoading || subscriptionLoading;

  return {
    unreadCount,
    loading,
    error,
  };
};