// src/app/tourist/home/hooks/useNotificationCount.ts
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
  const { user } = useAuth(); // Get authenticated user from auth hook
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Initial fetch of unread notification count
  const { data: initialData, loading: initialLoading, error: initialError } =
    useQuery(GET_UNREAD_NOTIFICATIONS_COUNT, {
      variables: { userId: user?.id },
      skip: !user?.id, // Skip query if user is not authenticated
      fetchPolicy: 'network-only',
    });

  // Real-time subscription to unread notification count
  const { data: subscriptionData, loading: subscriptionLoading } =
    useSubscription(SUBSCRIBE_UNREAD_NOTIFICATIONS_COUNT, {
      variables: { userId: user?.id },
      skip: !user?.id, // Skip subscription if user is not authenticated
    });

  // Update unread count when initial data is fetched
  useEffect(() => {
    if (initialData?.notifications_aggregate?.aggregate?.count !== undefined) {
      setUnreadCount(initialData.notifications_aggregate.aggregate.count);
    }
  }, [initialData]);

  // Update unread count when subscription data changes
  useEffect(() => {
    if (
      subscriptionData?.notifications_aggregate?.aggregate?.count !== undefined
    ) {
      setUnreadCount(subscriptionData.notifications_aggregate.aggregate.count);
    }
  }, [subscriptionData]);

  // Handle errors gracefully
  const error = initialError
    ? new Error(t('notifications.error.fetch_failed'))
    : null;

  // Combined loading state
  const loading = initialLoading || subscriptionLoading;

  return {
    unreadCount,
    loading,
    error,
  };
};