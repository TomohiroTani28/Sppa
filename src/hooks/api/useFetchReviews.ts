// src/hooks/api/useFetchReviews.ts
import { useQuery, gql } from "@apollo/client";
import { Review } from "@/types/review";

// セラピストのレビューを取得するクエリ
const GET_THERAPIST_REVIEWS = gql`
  query GetTherapistReviews($therapistId: ID!, $limit: Int, $offset: Int) {
    reviews(
      filter: { therapistId: $therapistId }
      limit: $limit
      offset: $offset
      orderBy: { createdAt: DESC }
    ) {
      id
      rating
      comment
      createdAt
      reviewType
      isAnonymous
      mediaUrls
      guest {
        id
        name
        profilePicture
      }
    }
    reviewsCount(filter: { therapistId: $therapistId })
  }
`;

// 予約に関連するレビューを取得するクエリ
const GET_BOOKING_REVIEW = gql`
  query GetBookingReview($bookingId: ID!) {
    review(filter: { bookingId: $bookingId }) {
      id
      rating
      comment
      createdAt
      reviewType
      isAnonymous
      mediaUrls
      guest {
        id
        name
        profilePicture
      }
    }
  }
`;

interface FetchReviewsOptions {
  limit?: number;
  offset?: number;
}

/**
 * セラピストのレビューを取得するカスタムフック
 */
export const useFetchReviews = (
  therapistId: string,
  options: FetchReviewsOptions = {},
) => {
  const { limit = 10, offset = 0 } = options;

  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_THERAPIST_REVIEWS,
    {
      variables: {
        therapistId,
        limit,
        offset,
      },
      skip: !therapistId,
      fetchPolicy: "cache-and-network",
    },
  );

  const reviews = data?.reviews || [];
  const totalCount = data?.reviewsCount || 0;

  const loadMore = (newOffset: number) => {
    fetchMore({
      variables: {
        therapistId,
        limit,
        offset: newOffset,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          ...fetchMoreResult,
          reviews: [...prev.reviews, ...fetchMoreResult.reviews],
        };
      },
    });
  };

  return {
    reviews,
    loading,
    error,
    totalCount,
    loadMore,
    refetch,
  };
};

/**
 * 特定の予約に関連するレビューを取得するカスタムフック
 */
export const useFetchBookingReview = (bookingId: string) => {
  const { data, loading, error } = useQuery(GET_BOOKING_REVIEW, {
    variables: { bookingId },
    skip: !bookingId,
    fetchPolicy: "cache-and-network",
  });

  return {
    review: data?.review,
    loading,
    error,
  };
};
