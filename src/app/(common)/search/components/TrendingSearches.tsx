"use client";
// src/app/(common)/search/components/TrendingSearches.tsx

import React, { FC } from "react";
import { useFetchTrends } from "@/hooks/api/useFetchTrends";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";

// Define the expected return type from useFetchTrends
interface UseFetchTrendsResult {
  trends: string[];
  loading: boolean;
  error?: Error;
}

// Define props interface for TrendTags
interface TrendTagsProps {
  tags: string[];
}

// Define TrendTags component inline
const TrendTags: FC<TrendTagsProps> = ({ tags }) => {
  return (
    <div>
      {tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
    </div>
  );
};

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

  if (!trends) {
    return (
      <Alert variant="error">
        <p>No data returned.</p>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trending Searches</CardTitle>
      </CardHeader>
      <CardContent>
        {trends.length === 0 ? (
          <p className="text-sm text-muted-foreground">No trends available.</p>
        ) : (
          <TrendTags tags={trends} />
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingSearches;