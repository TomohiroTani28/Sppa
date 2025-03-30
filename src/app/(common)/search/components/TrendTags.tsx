"use client";
// src/app/(common)/search/components/TrendTags.tsx
import React, { FC } from "react";
import { useFetchTrends } from "@/hooks/api/useFetchTrends";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";

// Define props for TrendTags component
interface TrendTagsProps {
  tags: string[];
}

// Define the expected return type from useFetchTrends
interface UseFetchTrendsResult {
  trends: string[];
  loading: boolean;
  error?: Error; // Added error as an optional property
}

// TrendTags component with unique keys
const TrendTags: FC<TrendTagsProps> = ({ tags }) => (
  <div>
    {tags.map((tag) => (
      <span key={tag} className="tag"> {/* Use tag value as key instead of index */}
        {tag}
      </span>
    ))}
  </div>
);

/**
 * TrendingSearches コンポーネント
 * 
 * - 現在人気の検索ワードやトレンドデータを一覧表示
 * - カスタムフック `useFetchTrends` などを使用してデータを取得すると想定
 * - ユーザーがクリックすると検索画面に遷移するなどの処理を追加
 */
const TrendingSearches: FC = () => {
  const { trends, loading, error } = useFetchTrends() as UseFetchTrendsResult;

  if (loading) {
    return (
      <div className="flex justify-center mt-4">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <p>Failed to load trending searches: {error.message}</p>
      </Alert>
    );
  }

  const trendingKeywords = trends || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trending Searches</CardTitle>
      </CardHeader>
      <CardContent>
        {trendingKeywords.length === 0 ? (
          <p className="text-sm text-muted-foreground">No trends available.</p>
        ) : (
          <TrendTags tags={trendingKeywords} />
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingSearches;