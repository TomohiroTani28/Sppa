// src/realtime/useRealtimeReviews.ts
import { useSubscription, gql } from "@apollo/client";

const LISTEN_FOR_NEW_REVIEWS = gql`
  subscription ListenForNewReviews($therapistId: uuid!) {
    reviews(
      where: { therapist_id: { _eq: $therapistId } }
      order_by: { created_at: desc }
    ) {
      id
      rating
      comment
      created_at
      guest_id
      therapist_id
      review_type
      media_urls
      booking_id
    }
  }
`;

const useRealtimeReviews = (therapistId: string) => {
  const { data, loading, error } = useSubscription(LISTEN_FOR_NEW_REVIEWS, {
    variables: { therapistId },
    skip: !therapistId,
  });

  return {
    realtimeReviews: data?.reviews || [],
    loading,
    error,
  };
};

export default useRealtimeReviews;
