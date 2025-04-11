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
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React, { Suspense, useCallback, useMemo, useState, useTransition } from "react";
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

interface FeedClientProps {
  initialPosts: Post[];
}

export const FeedClient: React.FC<FeedClientProps> = ({ initialPosts }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"tourist" | "therapist">("tourist");
  const [isPending, startTransition] = useTransition(); // React 19 Concurrent Mode
  
  const { 
    feedData, 
    loading, 
    error, 
    connectionStatus 
  } = useRealtimeFeedUpdates(selectedTab, initialPosts);

  const handleTabChange = useCallback((tab: "tourist" | "therapist") => {
    // タブ変更をトランジションとして扱い、UIのレスポンシブ性を維持
    startTransition(() => {
      setSelectedTab(tab);
    });
  }, []);

  const userData = useMemo(() => user ? {
    id: user.id,
    name: user.name ?? "Unknown User",
    profilePicture: user.image ?? "/default-avatar.png",
    email: user.email ?? "",
    role: user.role,
  } : null, [user]);

  // 接続ステータスをコンソールに表示
  console.log("[FeedClient] WS Connection Status:", connectionStatus);

  // メイン表示
  return (
    <div className="container mx-auto px-4 py-8">
      {error && <ErrorDisplay error={error} onRetry={() => window.location.reload()} />}
      
      <FeedFilters
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        userRole={userData?.role ?? ""}
      />
      
      <ErrorBoundary 
        fallback={<ErrorDisplay error={t("errors.feedError")} t={t} onRetry={() => window.location.reload()} />}
      >
        <Suspense fallback={<LoadingSpinner />}>
          {loading || isPending ? (
            <LoadingSpinner />
          ) : (
            <MasonryFeed
              posts={feedData}
              hasMore={false}
              isLoading={loading}
              onLoadMore={() => {}}
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};