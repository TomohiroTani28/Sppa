// src/hooks/api/useUnreadNotifications.ts
import { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import { useAuth } from "@/hooks/api/useAuth";
import { Notification } from '@/types/notification';

// GraphQL query to fetch unread notifications
const GET_UNREAD_NOTIFICATIONS = gql`
  query GetUnreadNotifications($userId: UUID!) {
    notifications(
      where: { user_id: { _eq: $userId }, is_read: { _eq: false } }
      order_by: { created_at: desc }
    ) {
      id
      type
      message
      details
      created_at
      updated_at
    }
  }
`;

// GraphQL mutation to mark notifications as read
const MARK_NOTIFICATIONS_READ = gql`
  mutation MarkNotificationsAsRead($ids: [UUID!]!) {
    update_notifications(
      where: { id: { _in: $ids } },
      _set: { is_read: true }
    ) {
      affected_rows
    }
  }
`;

// GraphQL subscription for new notifications
const SUBSCRIBE_TO_NOTIFICATIONS = gql`
  subscription OnNewNotification($userId: UUID!) {
    notifications(
      where: { 
        user_id: { _eq: $userId }, 
        is_read: { _eq: false },
        created_at: { _gt: "now() - interval '10 minute'" }
      }
      order_by: { created_at: desc }
    ) {
      id
      type
      message
      details
      created_at
      updated_at
    }
  }
`;

// Helper function to map database response to frontend model
const mapApiNotificationToModel = (apiNotification: any): Notification => ({
  ...apiNotification,
  isRead: false, // API returns only unread notifications
});

export function useUnreadNotifications(notificationsData?: Notification[]) {
  const auth = useAuth(); // Get the auth object instead of destructuring
  const [user, setUser] = useState<{ id: string } | null>(null); // State for user
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const authState = await auth.getAuthState();
      setUser(authState.user);
    };
    fetchUser();
  }, [auth]);

  const userId = user?.id;

  // Query to fetch initial unread notifications
  const { data, loading, error, refetch } = useQuery(GET_UNREAD_NOTIFICATIONS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  // Mutation to mark notifications as read
  const [markAsRead] = useMutation(MARK_NOTIFICATIONS_READ);

  // Subscribe to new notifications
  const { data: subscriptionData } = useSubscription(SUBSCRIBE_TO_NOTIFICATIONS, {
    variables: { userId },
    skip: !userId,
  });

  // Update state when initial data is fetched
  useEffect(() => {
    if (data?.notifications) {
      const mappedNotifications = data.notifications.map(mapApiNotificationToModel);
      setUnreadNotifications(mappedNotifications);
      setUnreadCount(mappedNotifications.length);
    }
  }, [data]);

  // Handle direct notifications data if provided
  useEffect(() => {
    if (notificationsData) {
      const unreadNotifs = notificationsData.filter(n => !n.isRead);
      setUnreadNotifications(unreadNotifs);
      setUnreadCount(unreadNotifs.length);
    }
  }, [notificationsData]);

  // Process and update new notifications from subscription
  const processNewSubscriptionData = useCallback(() => {
    if (!subscriptionData?.notifications) return;

    const newNotificationsFromApi = subscriptionData.notifications.map(mapApiNotificationToModel);
    const uniqueNewNotifications = newNotificationsFromApi.filter(
      (newNotif: Notification) => !unreadNotifications.some(existing => existing.id === newNotif.id)
    );

    if (uniqueNewNotifications.length > 0) {
      setUnreadNotifications(prev => [...uniqueNewNotifications, ...prev]);
      setUnreadCount(prev => prev + uniqueNewNotifications.length);
    }
  }, [subscriptionData, unreadNotifications]);

  // Update state when new notifications arrive from subscription
  useEffect(() => {
    processNewSubscriptionData();
  }, [subscriptionData, processNewSubscriptionData]);

  // Function to mark specific notifications as read
  const markNotificationsAsRead = useCallback(async (notificationIds: string[]) => {
    if (!notificationIds.length || !userId) return;

    try {
      await markAsRead({
        variables: { ids: notificationIds },
      });
      setUnreadNotifications(prev =>
        prev.filter(notification => !notificationIds.includes(notification.id))
      );
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  }, [markAsRead, userId]);

  // Function to mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!unreadNotifications.length || !userId) return;

    const notificationIds = unreadNotifications.map(notification => notification.id);

    try {
      await markAsRead({
        variables: { ids: notificationIds },
      });
      setUnreadNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, [markAsRead, unreadNotifications, userId]);

  // Manually refresh notifications
  const refreshNotifications = useCallback(() => {
    if (userId) {
      refetch({ userId });
    }
  }, [refetch, userId]);

  return {
    unreadNotifications,
    unreadCount,
    loading,
    error,
    markNotificationsAsRead,
    markAllAsRead,
    refreshNotifications,
  };
}

export default useUnreadNotifications;