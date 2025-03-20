// src/app/therapist/hooks/useReviewData.ts
import { useQuery } from "@apollo/client";
import { GET_REVIEWS } from "@/backend/api/graphql/reviews";
import useRealtimeReviews from "../../hooks/realtime/useRealtimeReviews";

export const useReviewData = (therapistId: string) => {
  const { data, loading, error } = useQuery(GET_REVIEWS, {
    variables: { therapistId },
  });

  // Real-time updates for reviews
  useRealtimeReviews(therapistId);

  return { data, loading, error };
};
