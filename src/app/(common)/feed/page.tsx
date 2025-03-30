"use client";
// src/app/(common)/feed/page.tsx
import { Suspense, useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import HomeHeader from "@/components/HomeHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { MasonryFeed } from "@/app/(common)/feed/components/MasonryFeed";
import Text from "@/components/ui/Text";
import { TabSelector } from "@/app/(common)/feed/components/TabSelector";
import { useAuth } from "@/hooks/api/useAuth";
import { useNotifications } from "@/realtime/useNotifications";
import useTherapistData from "@/hooks/api/useTherapistData";

// 型定義
interface Notification {
  id: string;
  message?: string | null;
  type: string;
  is_read: boolean;
}

// ErrorDisplay コンポーネント
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

// HomeMainContent コンポーネント
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

// getUserData 関数
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

  // Move hooks to top level to ensure they're always called
  const { notifications, error: notificationsError } = useNotifications(userId);
  const { therapistData, loading: therapistLoading, error: therapistError } = useTherapistData(userId, authLoading, role);

  // Calculate all derived state here, before any conditional returns
  const userData = getUserData(user);
  
  // 未読通知数の計算
  const unreadCount = useMemo(() => {
    return notifications?.filter((n: Notification) => !n.is_read)?.length || 0;
  }, [notifications]);

  // エラーメッセージの処理
  const notificationErrorMessage = notificationsError ? notificationsError.message : null;
  const therapistErrorMessage = therapistError ? therapistError.message : null;

  // All hooks are called before any conditional returns
  // Now we can safely have early returns
  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (role === "therapist" && therapistLoading) {
    return <LoadingSpinner />;
  }

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
        notificationError={notificationErrorMessage}
        therapistError={therapistErrorMessage}
      />
      <BottomNavigation />
    </Text>
  );
}