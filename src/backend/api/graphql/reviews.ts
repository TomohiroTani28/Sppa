// src/backend/api/graphql/reviews.ts
import { gql } from '@apollo/client';
import hasuraClient from '@/lib/hasura-client';

// セラピストのレビュー取得クエリ
export const GET_REVIEWS = gql`
  query GetReviews($therapistId: uuid!) {
    reviews(where: { therapist_id: { _eq: $therapistId } }) {
      id
      rating
      comment
      created_at
    }
  }
`;

// セラピストのレビューを取得する関数
export const fetchReviews = async (therapistId: string) => {
  const client = await hasuraClient();
  const result = await client.query({
    query: GET_REVIEWS,
    variables: { therapistId },
  });

  return result.data.reviews;
};