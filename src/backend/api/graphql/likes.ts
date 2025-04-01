// src/backend/api/graphql/likes.ts
import { gql } from '@apollo/client';
import hasuraClient from '@/lib/hasura-client';

// GraphQL ミューテーション定義
const LIKE_THERAPIST = gql`
  mutation LikeTherapist($guestId: uuid!, $therapistId: uuid!) {
    insert_likes(objects: { guest_id: $guestId, therapist_id: $therapistId }) {
      returning {
        id
        guest_id
        therapist_id
      }
    }
  }
`;

const CHECK_MATCH = gql`
  query CheckMatch($guestId: uuid!, $therapistId: uuid!) {
    likes(where: { guest_id: { _eq: $guestId }, therapist_id: { _eq: $therapistId }, is_matched: { _eq: true } }) {
      id
    }
  }
`;

// セラピストを「いいね」する
export const likeTherapist = async (guestId: string, therapistId: string) => {
  const result = await hasuraClient.mutate({
    mutation: LIKE_THERAPIST,
    variables: { guestId, therapistId },
  });
  return result.data.insert_likes.returning;
};

// マッチしているかを確認
export const checkMatch = async (guestId: string, therapistId: string) => {
  const result = await hasuraClient.query({
    query: CHECK_MATCH,
    variables: { guestId, therapistId },
  });
  return result.data.likes.length > 0;
};
