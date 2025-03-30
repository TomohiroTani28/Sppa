"use client";
// src/app/tourist/notifications/page.tsx
import React from "react";
import { useNotifications, Notification } from "@/app/hooks/realtime/useNotifications";
import { useAuth } from "@/hooks/api/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Spinner } from "@/app/components/ui/Spinner";
import { useTranslation } from "react-i18next";
import { useMutation, gql } from "@apollo/client";

/**
 * GraphQL mutation to mark a notification as read
 */
const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: uuid!) {
    update_notifications_by_pk(pk_columns: { id: $id }, _set: { is_read: true }) {
      id
      is_read
    }
  }
`;

/**
 * NotificationItem component to display individual notifications
 */
const NotificationItem: React.FC<{
  notification: Notification;
  t: (key: string, options?: any) => string;
  handleMarkAsRead: (id: string) => void;
  mutationLoading: boolean;
}> = ({ notification, t, handleMarkAsRead, mutationLoading }) => (
  <Card key={notification.id} className="shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg">{t(`types.${notification.type}`)}</CardTitle>
      {!notification.is_read && (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {t("unread")}
        </Badge>
      )}
    </CardHeader>
    <CardContent>
      <p className="text-gray-700">{notification.message ?? t("defaultMessage")}</p>
      <p className="text-sm text-gray-500 mt-1">
        {new Date(notification.created_at).toLocaleString()}
      </p>
      {!notification.is_read && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => handleMarkAsRead(notification.id)}
          disabled={mutationLoading}
        >
          {mutationLoading ? <Spinner /> : t("markAsRead")}
        </Button>
      )}
    </CardContent>
  </Card>
);

/**
 * Notifications page for tourists
 * Displays a real-time list of notifications with options to mark them as read
 */
const NotificationsPage: React.FC = () => {
  const { t } = useTranslation("notifications");
  const { user } = useAuth();
  const { notifications, isLoading, error } = useNotifications(user?.id);
  const [markNotificationRead, { loading: mutationLoading }] = useMutation(MARK_NOTIFICATION_READ);

  /**
   * Handle marking a notification as read
   * @param notificationId The ID of the notification to mark as read
   */
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationRead({
        variables: { id: notificationId },
        optimisticResponse: {
          update_notifications_by_pk: {
            id: notificationId,
            is_read: true,
            __typename: "notifications",
          },
        },
      });
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 text-red-500">
        {t("error", { message: error.message })}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">{t("title")}</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-600">{t("noNotifications")}</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              t={t}
              handleMarkAsRead={handleMarkAsRead}
              mutationLoading={mutationLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;