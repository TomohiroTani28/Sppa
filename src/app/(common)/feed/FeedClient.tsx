"use client";
// src/app/(common)/feed/FeedClient.tsx
import { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import HomeHeader from "@/components/HomeHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { MasonryFeed } from "@/app/(common)/feed/components/MasonryFeed";
import Text from "@/components/ui/Text";
import { TabSelector } from "@/app/(common)/feed/components/TabSelector";
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
            posts={feedData}
            loading={loading}
            error={error?.message || null}
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

export default function FeedClient() {
  const { data: session, status } = useSession();
  const { t } = useTranslation("common");
  const [selectedTab, setSelectedTab] = useState<"tourist" | "therapist">("tourist");

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  const userData = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? "Unknown User",
        profilePicture: session.user.image ?? "/default-avatar.png",
        email: session.user.email ?? "",
      }
    : null;

  return (
    <Text tag="div" className="min-h-screen bg-background">
      {userData && (
        <HomeHeader
          user={userData}
          unreadCount={0}
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