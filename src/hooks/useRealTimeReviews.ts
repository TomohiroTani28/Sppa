// src/hooks/useRealTimeReviews.ts

import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { gql, useSubscription } from '@apollo/client';
import type { Review } from '@/types/review';

// GraphQL Subscription for real-time reviews
const REVIEWS_SUBSCRIPTION = gql`
  subscription OnReviewsUpdated($therapistId: UUID!) {
    reviews(
      where: { therapist_id: { _eq: $therapistId } }
      order_by: { created_at: desc }
    ) {
      id
      booking_id
      guest_id
      therapist_id
      rating
      comment
      review_type
      media_urls
      created_at
      updated_at
    }
  }
`;

// Type definition for the subscription data
interface ReviewsSubscriptionData {
  reviews: Review[];
}

// Type definition for the hook's return value
interface UseRealTimeReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch and subscribe to real-time reviews for a specific therapist
 * @param therapistId - The UUID of the therapist
 * @returns Object containing reviews, loading state, and error
 */
export function useRealTimeReviews(therapistId: string): UseRealTimeReviewsReturn {
  const { t } = useTranslation('common'); // i18n support
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use Apollo's useSubscription hook for real-time updates
  const { data, loading, error: subscriptionError } = useSubscription<ReviewsSubscriptionData>(
    REVIEWS_SUBSCRIPTION,
    {
      variables: { therapistId },
      skip: !therapistId, // Skip subscription if no therapistId is provided
      onError: (err) => {
        console.error('Subscription error:', err);
        setError(t('errors.subscription_failed'));
      },
    }
  );

  // Update reviews when new data arrives
  useEffect(() => {
    if (data?.reviews) {
      setReviews(data.reviews);
      setError(null); // Clear any previous errors on successful update
    }
  }, [data]);

  // Handle subscription errors
  useEffect(() => {
    if (subscriptionError) {
      setError(t('errors.subscription_failed'));
    }
  }, [subscriptionError, t]);

  return {
    reviews,
    loading,
    error,
  };
}

/**
 * Example usage:
 * ```tsx
 * import { useRealTimeReviews } from './useRealTimeReviews';
 * 
 * function TherapistReviews({ therapistId }: { therapistId: string }) {
 *   const { reviews, loading, error } = useRealTimeReviews(therapistId);
 * 
 *   if (loading) return <Spinner />;
 *   if (error) return <div>{error}</div>;
 * 
 *   return (
 *     <div>
 *       {reviews.map((review) => (
 *         <ReviewCard key={review.id} review={review} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */