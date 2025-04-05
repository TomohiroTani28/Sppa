// src/app/(common)/feed/FeedClient.tsx
"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import HomeHeader from "@/components/HomeHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { MasonryFeed } from "@/app/(common)/feed/components/MasonryFeed";
import Text from "@/components/ui/Text";
import { TabSelector } from "@/app/(common)/feed/components/TabSelector";
import { useAuth } from "@/hooks/api/useAuth";
import { useRealtimeFeedUpdates } from "@/realtime/useRealtimeFeedUpdates";
import Link from "next/link";

interface ErrorDisplayProps {
  error: string | null;
  t: (key: string) => string;
}

const ErrorDisplay = ({ error, t }: ErrorDisplayProps) => {
  if (!error) return null;
  return (
    <Text tag="div" className="px-4 py-2 text-error text-center">
      {error}
      <button
        className="ml-2 text-primary underline"
        onClick={() => window.location.reload()}
      >
        {t("retry")}
      </button>
    </Text>
  );
};

interface HomeMainContentProps {
  userData: { id: string; name: string; profilePicture: string; email: string } | null;
  selectedTab: "tourist" | "therapist";
  t: (key: string) => string;
  feedError: string | null;
}

const HomeMainContent = ({
  userData,
  selectedTab,
  t,
  feedError,
}: HomeMainContentProps) => {
  const safeUserId: string = userData?.id ?? "";
  const { feedData, loading, error } = useRealtimeFeedUpdates(selectedTab);

  return (
    <Text tag="main" className="py-4">
      <ErrorDisplay error={feedError ?? error?.message ?? null} t={t} />
      <Suspense fallback={<LoadingSpinner />}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <MasonryFeed
            userId={safeUserId}
            posts={feedData} // selectedTab を削除
            loading={loading}   // オプションで渡す
            error={error?.message || null} // オプションで渡す
          />
        )}
      </Suspense>
      <Link href="/notifications" prefetch={false}>
        <Text tag="span" className="text-primary underline">
          {t("viewNotifications")}
        </Text>
      </Link>
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

export default function FeedClient() {
  const { t } = useTranslation("common");
  const { user, loading: authLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"tourist" | "therapist">("tourist");

  const userData = getUserData(user);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Text tag="div" className="min-h-screen bg-background">
      {userData && (
        <HomeHeader
          user={userData}
          unreadCount={0} // Placeholder until notifications are implemented
          t={t}
          aria-label={t("header.ariaLabel")}
        />
      )}
      <TabSelector selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <HomeMainContent
        userData={userData}
        selectedTab={selectedTab}
        t={t}
        feedError={null}
      />
      <BottomNavigation />
    </Text>
  );
}
