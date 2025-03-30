"use client";
// src/app/hooks/api/useFetchTrends.ts
import { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { useErrorLogApi } from "./useErrorLogApi";
import { error_type_enum } from "@/types/enums";
import type { ErrorLogCreateInput } from "@/types/error-log";

// GraphQL query to fetch trending search terms
const GET_TRENDING_SEARCHES = gql`
  query GetTrendingSearches {
    search_trends(limit: 10, order_by: { search_count: desc }) {
      term
      search_count
    }
  }
`;

// Types for the trending searches data
interface TrendingSearch {
  term: string;
  search_count: number;
}

interface TrendingSearchesData {
  search_trends: TrendingSearch[];
}

// Default trending searches to use as fallback
const DEFAULT_TRENDS = [
  "バリニーズマッサージ",
  "ヨガ",
  "スパ",
  "リラクゼーション",
  "アロマセラピー",
  "ウブド",
  "クタ",
  "スミニャック",
];

/**
 * Hook to fetch trending search terms
 * @returns Object containing trending search terms and loading state
 */
export const useFetchTrends = () => {
  const [trends, setTrends] = useState<string[]>([]);
  const { createErrorLog } = useErrorLogApi();

  // Execute the query to fetch trending searches
  const { data, loading, error } = useQuery<TrendingSearchesData>(
    GET_TRENDING_SEARCHES,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      onError: (error) => {
        if (createErrorLog) {
          try {
            const errorLog: ErrorLogCreateInput = {
              error_type: error_type_enum.API_ERROR,
              message: `Failed to fetch trending searches: ${error.message}`,
              stack_trace: error.stack || "",
              request_details: {
                query: GET_TRENDING_SEARCHES.loc?.source.body,
              },
            };

            createErrorLog(errorLog);
          } catch (logError) {
            console.error("Error logging API error:", logError);
          }
        }
      },
    },
  );

  // Handle data from the API
  useEffect(() => {
    if (data?.search_trends && data.search_trends.length > 0) {
      // Extract just the search terms from the data
      const trendTerms = data.search_trends.map((trend) => trend.term);
      setTrends(trendTerms);
    } else if (!loading && trends.length === 0) {
      // Set default trends if data is loaded but empty
      setTrends(DEFAULT_TRENDS);
    }
  }, [data, loading]);

  return { trends, loading };
};

export default useFetchTrends;
