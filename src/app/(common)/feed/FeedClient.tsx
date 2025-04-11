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
import { Post } from "@/types/post";
import { RefreshCw } from "lucide-react";
import type { Session } from "next-auth";
import Link from "next/link";
import React, { Suspense, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { FeedFilters } from "./components/FeedFilters";

interface ErrorDisplayProps {
  error: string | null;
  t?: (key: string) => string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = React.memo(({ error, t, onRetry }) => {
  if (!error) return null;
  
  return (
    <Alert variant="error" className="mb-4">
      <AlertTitle>{t ? t("errors.title") : "Error"}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="ml-4"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {t ? t("retry") : "Retry"}
        </Button>
      </AlertDescription>
    </Alert>
  );
});

ErrorDisplay.displayName = "ErrorDisplay";

interface HomeMainContentProps {
  user: Session['user'] | null;
  selectedTab: "tourist" | "therapist";
  t: (key: string) => string;
  feedError: string | null;
  onTabChange: (tab: "tourist" | "therapist") => void;
}

const HomeMainContent = React.memo(({
  user,
  selectedTab,
  t,
  feedError,
  onTabChange,
}: HomeMainContentProps) => {
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
          userRole={user?.role ?? ""}
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

export function FeedClient({ initialPosts }: { initialPosts: Post[] }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"tourist" | "therapist">("tourist");
  const [feedError, setFeedError] = useState<string | null>(null);

  const handleTabChange = useCallback((tab: "tourist" | "therapist") => {
    setSelectedTab(tab);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <HomeMainContent
        user={user}
        selectedTab={selectedTab}
        t={t}
        feedError={feedError}
        onTabChange={handleTabChange}
      />
    </div>
  );
}