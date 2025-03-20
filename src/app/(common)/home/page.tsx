"use client";
// src/app/(common)/home/page.tsx

import { Suspense, useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { LoadingSpinner } from "@/app/components/common/LoadingSpinner";
import HomeHeader from "@/app/components/common/HomeHeader";
import BottomNavigation from "@/app/components/common/BottomNavigation";
import { MasonryFeed } from "./components/MasonryFeed";
import Text from "@/app/components/ui/Text";
import { TabSelector } from "@/app/(common)/home/components/TabSelector";
import { useAuth } from "@/app/hooks/api/useAuth";

// 型定義
interface Notification {
  id: string;
  message: string;
  type: string;
  is_read?: boolean;
}

interface TherapistData {
  id: string;
  userId: string;
  bio: string;
  languages: string[];
  workingHours: { day: string; startTime: string; endTime: string }[];
  status: "online" | "offline" | "busy" | "vacation";
}

/**
 * Sppa向けモックデータ・フック例
 */
const mockNotifications: Notification[] = [
  { id: "notif-1", message: "Your booking has been confirmed!", type: "booking_update", is_read: false },
  { id: "notif-2", message: "New review received", type: "review", is_read: true },
  { id: "notif-3", message: "You have a new chat message", type: "chat", is_read: false },
];

const useNotificationsMock = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (userId) {
        setNotifications(mockNotifications);
      } else {
        setError("User not authenticated");
      }
      setLoading(false);
    }, 1000);
  }, [userId]);

  return { notifications, loading, error };
};

const useTherapistDataMock = (userId: string, authLoading: boolean, role: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (role !== "therapist") {
        setError(null);
      }
      setLoading(false);
    }, 1500);
  }, [userId, role]);

  return { loading, error };
};

interface ErrorDisplayProps {
  error: string | null;
  t: (key: string) => string;
}

const ErrorDisplay = ({ error, t }: ErrorDisplayProps) => {
  if (!error) return null;
  return (
    <Text tag="div" className="px-4 py-2 text-error text-center">
      {error}
      <button className="ml-2 text-primary underline" onClick={() => window.location.reload()}>
        {t("retry")}
      </button>
    </Text>
  );
};

interface HomeMainContentProps {
  userData: any;
  selectedTab: "tourist" | "therapist";
  t: (key: string) => string;
  notificationError: string | null;
  therapistError: string | null;
}

const HomeMainContent = ({
  userData,
  selectedTab,
  t,
  notificationError,
  therapistError,
}: HomeMainContentProps) => {
  const safeUserId: string = userData?.id ?? "";
  return (
    <Text tag="main" className="py-4">
      <ErrorDisplay error={notificationError ?? therapistError} t={t} />
      <Suspense fallback={<LoadingSpinner />}>
        <MasonryFeed userId={safeUserId} selectedTab={selectedTab} />
      </Suspense>
    </Text>
  );
};

const getUserData = (user: any) =>
  user
    ? {
        id: user.id,
        name: user.user_metadata?.name ?? "Unknown User",
        profilePicture: user.user_metadata?.profile_picture ?? "/default-avatar.png",
        email: user.email ?? "",
      }
    : null;

export default function SppaHomePage() {
  const { t } = useTranslation("common");
  const { user, role, loading: authLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"tourist" | "therapist">("tourist");
  const userId = user?.id;

  console.log("User ID:", userId, "Role:", role ?? "tourist");

  // モック通知データ取得
  const { notifications, error: notificationsError } = useNotificationsMock(userId);
  // セラピストの場合のモックデータ取得
  const { loading: therapistLoading, error: therapistError } = useTherapistDataMock(userId ?? "", authLoading, role);

  // ローディング処理を明示的にする
  if (authLoading) {
    return <LoadingSpinner />;
  }
  if (role === "therapist" && therapistLoading) {
    return <LoadingSpinner />;
  }

  const userData = getUserData(user);
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const therapistErrorToDisplay = role === "therapist" ? therapistError : null;

  return (
    <Text tag="div" className="min-h-screen bg-background">
      {userData && (
        <HomeHeader user={userData} unreadCount={unreadCount} t={t} aria-label={t("header.ariaLabel")} />
      )}
      <TabSelector selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <HomeMainContent
        userData={userData}
        selectedTab={selectedTab}
        t={t}
        notificationError={notificationsError}
        therapistError={therapistErrorToDisplay}
      />
      <BottomNavigation />
    </Text>
  );
}
