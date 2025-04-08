// src/hooks/api/useFetchTherapists.ts
import type { Therapist } from "@/types/therapist";
import { gql, useQuery } from "@apollo/client";
import { useCallback } from "react";

// セラピスト一覧を取得する GraphQL クエリ
const GET_THERAPISTS = gql`
  query GetTherapists($filter: TherapistFilter, $limit: Int, $offset: Int) {
    therapists(filter: $filter, limit: $limit, offset: $offset) {
      id
      name
      profilePicture
      status
      rating
      priceRangeMin
      priceRangeMax
      currency
      languages
      location {
        lat
        lng
        address
      }
      services {
        id
        serviceName
        price
        currency
        duration
      }
    }
    therapistsCount(filter: $filter)
  }
`;

// 特定のセラピストの詳細を取得する GraphQL クエリ
const GET_THERAPIST_BY_ID = gql`
  query GetTherapistById($id: String!) {
    therapist(id: $id) {
      id
      name
      profilePicture
      status
      rating
      priceRangeMin
      priceRangeMax
      currency
      languages
      location {
        lat
        lng
        address
      }
      bio
      experienceYears
      businessName
      services {
        id
        serviceName
        price
        currency
        duration
      }
    }
  }
`;

// フィルター用のインターフェース
interface TherapistFilter {
  location?: {
    lat?: number;
    lng?: number;
    radius?: number; // km
  };
  services?: string[];
  languages?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  categories?: string[];
  rating?: number;
  status?: string;
  searchTerm?: string;
}

interface FetchTherapistsHook {
  therapists: Therapist[];
  loading: boolean;
  error: any;
  totalCount: number;
  fetchMore: (variables: { offset: number; limit: number }) => void;
  refetch: () => void;
}

interface FetchTherapistDetailsHook {
  therapist: Therapist | undefined;
  loading: boolean;
  error: any;
  refetch: () => void;
}

/**
 * セラピスト一覧を取得するカスタムフック
 */
export const useFetchTherapists = (
  filter: TherapistFilter = {},
  limit: number = 10,
  initialOffset: number = 0
): FetchTherapistsHook => {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_THERAPISTS, {
    variables: {
      filter,
      limit,
      offset: initialOffset,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const therapists = data?.therapists || [];
  const totalCount = data?.therapistsCount || 0;

  // fetchMore の拡張
  const handleFetchMore = useCallback(
    ({ offset, limit }: { offset: number; limit: number }) => {
      fetchMore({
        variables: {
          filter,
          offset,
          limit,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return offset === 0
            ? fetchMoreResult
            : {
                ...fetchMoreResult,
                therapists: [...prev.therapists, ...fetchMoreResult.therapists],
              };
        },
      });
    },
    [fetchMore, filter]
  );

  return {
    therapists,
    loading,
    error,
    totalCount,
    fetchMore: handleFetchMore,
    refetch,
  };
};

/**
 * 特定のセラピストの詳細を取得するカスタムフック
 */
export const useFetchTherapistDetails = (therapistId: string): FetchTherapistDetailsHook => {
  const { data, loading, error, refetch } = useQuery(GET_THERAPIST_BY_ID, {
    variables: { id: therapistId },
    skip: !therapistId,
    fetchPolicy: "cache-and-network",
  });

  const therapist = data?.therapist;

  return {
    therapist,
    loading,
    error,
    refetch,
  };
};