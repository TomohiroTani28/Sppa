// src/app/(common)/notifications/NotificationsClient.tsx
"use client";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/api/useAuth";
import { Notification, useNotifications } from "@/realtime/useNotifications";
import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useTranslation } from "react-i18next";

const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: uuid!) {
    update_notifications_by_pk(pk_columns: { id: $id }, _set: { is_read: true }) {
      id
      is_read
    }
  }
`;

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

const NotificationsClient: React.FC = () => {
  const { t } = useTranslation("notifications");
  const { user } = useAuth();
  const { notifications, isLoading, error } = useNotifications(user?.id);
  const [markNotificationRead, { loading: mutationLoading }] = useMutation(MARK_NOTIFICATION_READ);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

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

export default NotificationsClient;