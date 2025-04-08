// src/hooks/api/useFetchLocalExperiences.ts
import type { LocalExperience } from "@/types/local-experience";
import { gql, useQuery } from "@apollo/client";
import { useCallback, useState } from "react";

const GET_LOCAL_EXPERIENCES = gql`
  query GetLocalExperiences(
    $limit: Int
    $offset: Int
    $where: local_experiences_bool_exp
  ) {
    local_experiences(
      limit: $limit
      offset: $offset
      where: $where
      order_by: { created_at: desc }
    ) {
      id
      title
      description
      rating
      price
      currency
      duration
      location_id
      location {
        id
        name
        latitude
        longitude
      }
      media {
        id
        url
        type
        sort_order
      }
      is_trending
      created_at
      updated_at
    }
  }
`;

export const useFetchLocalExperiences = () => {
  const [experiences, setExperiences] = useState<LocalExperience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { refetch } = useQuery(GET_LOCAL_EXPERIENCES, {
    skip: true, // 自動実行をスキップ
    notifyOnNetworkStatusChange: true,
  });

  const fetchExperiences = useCallback(
    async (options?: { limit?: number; offset?: number; where?: any }) => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await refetch({
          limit: options?.limit || 10,
          offset: options?.offset || 0,
          where: options?.where || {},
        });

        if (data && data.local_experiences) {
          setExperiences(data.local_experiences);
        }
      } catch (err) {
        console.error("Error fetching local experiences:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch local experiences"),
        );
      } finally {
        setLoading(false);
      }
    },
    [refetch],
  );

  return {
    experiences,
    loading,
    error,
    fetchExperiences,
  };
};
