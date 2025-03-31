// src/hooks/api/useCreateReview.ts
import { useMutation } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import hasuraClient from "@/lib/hasura-client";
import { Review } from "@/types/review";

// GraphQL Mutation
const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReview(
    $bookingId: uuid!
    $guestId: uuid!
    $therapistId: uuid!
    $rating: numeric!
    $comment: String
    $reviewType: review_type_enum!
    $mediaUrls: jsonb
  ) {
    insert_reviews(
      objects: {
        booking_id: $bookingId
        guest_id: $guestId
        therapist_id: $therapistId
        rating: $rating
        comment: $comment
        review_type: $reviewType
        media_urls: $mediaUrls
      }
    ) {
      returning {
        id
        created_at
        rating
        comment
      }
    }
  }
`;

export const useCreateReview = () => {
  const mutation = useMutation({
    mutationFn: async (review: Review) => {
      const { data } = await hasuraClient.mutate({
        mutation: CREATE_REVIEW_MUTATION,
        variables: {
          bookingId: review.booking_id,
          guestId: review.guest_id,
          therapistId: review.therapist_id,
          rating: review.rating,
          comment: review.comment,
          reviewType: review.review_type,
          mediaUrls: review.media_urls,
        },
      });
      return data;
    },
  });

  return {
    createReview: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
