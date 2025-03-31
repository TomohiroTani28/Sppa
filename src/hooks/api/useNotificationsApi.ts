// src/hooks/api/useNotificationsApi.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import supabase from "@/lib/supabase-client";
import { Notification } from "@/types/notification";

const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_HTTPS_ENDPOINT;

/**
 * GraphQL: Fetch notifications for a specific user
 */
const GET_NOTIFICATIONS = gql`
  query GetNotifications($userId: uuid!) {
    notifications(where: { user_id: { _eq: $userId } }) {
      id
      type
      message
      is_read
      created_at
    }
  }
`;

/**
 * GraphQL: Update user preferences
 */
const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences($userId: uuid!, $enabled: Boolean!, $time: String!) {
    update_user_preferences(
      where: { user_id: { _eq: $userId } }
      _set: { reminder_enabled: $enabled, reminder_time: $time }
    ) {
      affected_rows
    }
  }
`;

export interface ReminderPreferences {
  enabled: boolean;
  time: string; // e.g., "1h", "24h", "48h"
}

export interface NotificationsApiHook {
  notifications: Notification[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateReminderPreferences: (prefs: ReminderPreferences) => Promise<void>;
}

/**
 * Fetch notifications and manage reminder preferences for a user
 * @param userId The user ID (UUID)
 */
export function useNotificationsApi(userId: string): NotificationsApiHook {
  const fetchNotifications = async (): Promise<Notification[]> => {
    if (!userId) return [];
    if (!HASURA_ENDPOINT) {
      throw new Error("Hasura endpoint is not defined");
    }
    const response = await request<{
      notifications: Notification[];
    }>(HASURA_ENDPOINT, GET_NOTIFICATIONS, { userId });
    return response.notifications;
  };

  const updatePreferences = async (prefs: ReminderPreferences) => {
    if (!HASURA_ENDPOINT) {
      throw new Error("Hasura endpoint is not defined");
    }
    const response = await request<{
      update_user_preferences: { affected_rows: number };
    }>(HASURA_ENDPOINT, UPDATE_USER_PREFERENCES, {
      userId,
      enabled: prefs.enabled,
      time: prefs.time,
    });
    if (response.update_user_preferences.affected_rows === 0) {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: userId,
          reminder_enabled: prefs.enabled,
          reminder_time: prefs.time,
        });
      if (error) throw error;
    }
  };

  const query = useQuery({
    queryKey: ["notifications", userId],
    queryFn: fetchNotifications,
    enabled: Boolean(userId),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      query.refetch();
    },
  });

  return {
    notifications: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: async () => {
      await query.refetch();
    },
    updateReminderPreferences: (prefs: ReminderPreferences) =>
      mutation.mutateAsync(prefs),
  };
}