// src/hooks/api/useCreateReview.ts
import hasuraClient from "@/lib/hasura-client";
import type { Review } from "@/types/review";
import { gql, useMutation } from "@apollo/client";

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
  const [createReviewMutation, { loading, error }] = useMutation(CREATE_REVIEW_MUTATION);

  const createReview = async (review: Review) => {
    try {
      const client = await hasuraClient();
      const { data } = await client.mutate({
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
    } catch (err) {
      console.error("Error creating review:", err);
      throw err;
    }
  };

  return {
    createReview,
    isLoading: loading,
    error,
  };
};