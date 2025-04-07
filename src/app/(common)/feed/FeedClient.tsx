"use client";
// src/app/(common)/feed/FeedClient.tsx
import { MasonryFeed } from "@/app/(common)/feed/components/MasonryFeed";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtimeFeedUpdates } from "@/realtime/useRealtimeFeedUpdates";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React, { Suspense, useCallback, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FeedFilters } from "./components/FeedFilters";

interface ErrorDisplayProps {
  error: string | null;
  t: (key: string) => string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = React.memo(({ error, t, onRetry }) => {
  if (!error) return null;
  
  return (
    <Alert variant="error" className="mb-4">
      <AlertTitle>{t("errors.title")}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="ml-4"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {t("retry")}
        </Button>
      </AlertDescription>
    </Alert>
  );
});

ErrorDisplay.displayName = "ErrorDisplay";

interface HomeMainContentProps {
  userData: { id: string; name: string; profilePicture: string; email: string; role?: string | undefined } | null;
  selectedTab: "tourist" | "therapist";
  t: (key: string) => string;
  feedError: string | null;
  onTabChange: (tab: "tourist" | "therapist") => void;
}

const HomeMainContent = React.memo(({
  userData,
  selectedTab,
  t,
  feedError,
  onTabChange,
}: HomeMainContentProps) => {
  const safeUserId: string = userData?.id ?? "";
  const { feedData, loading, error } = useRealtimeFeedUpdates(selectedTab);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleLoadMore = useCallback(() => {
    // Implement load more functionality if needed
  }, []);

  const memoizedFeed = useMemo(() => (
    <MasonryFeed
      posts={feedData}
      hasMore={false}
      isLoading={loading}
      onLoadMore={handleLoadMore}
    />
  ), [feedData, loading, handleLoadMore]);

  return (
    <Text tag="main" className="py-4">
      <ErrorDisplay error={feedError ?? error ?? null} t={t} onRetry={handleRetry} />
      <div ref={ref}>
        {inView && (
          <ErrorBoundary fallback={<ErrorDisplay error={t("errors.feedError")} t={t} onRetry={handleRetry} />}>
            <Suspense fallback={<LoadingSpinner />}>
              {loading ? (
                <LoadingSpinner />
              ) : (
                memoizedFeed
              )}
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
      <div className="mt-4 px-4">
        <FeedFilters
          selectedTab={selectedTab}
          onTabChange={onTabChange}
          userRole={userData?.role ?? ""}
        />
      </div>
      <Link href="/notifications" prefetch={false} className="block text-center mt-4">
        <Text tag="span" className="text-primary underline hover:text-primary/80 transition-colors">
          {t("viewNotifications")}
        </Text>
      </Link>
    </Text>
  );
});

HomeMainContent.displayName = "HomeMainContent";

export const FeedClient: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"tourist" | "therapist">("tourist");
  const { error } = useRealtimeFeedUpdates(selectedTab);

  const handleTabChange = useCallback((tab: "tourist" | "therapist") => {
    setSelectedTab(tab);
  }, []);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const userData = useMemo(() => user ? {
    id: user.id,
    name: user.name ?? "Unknown User",
    profilePicture: user.image ?? "/default-avatar.png",
    email: user.email ?? "",
    role: user.role,
  } : null, [user]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <ErrorDisplay error={error} t={t} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <HomeMainContent
        userData={userData}
        selectedTab={selectedTab}
        t={t}
        feedError={error}
        onTabChange={handleTabChange}
      />
    </div>
  );
};