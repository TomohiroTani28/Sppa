// src/hooks/api/useLikeUser.ts
import { gql, useMutation } from "@apollo/client";

// 好きな命名でOKです
const INSERT_LIKE_MUTATION = gql`
  mutation InsertLike($likerId: uuid!, $likedUserId: uuid!) {
    insert_likes_one(object: { liker_id: $likerId, liked_user_id: $likedUserId }) {
      id
      liker_id
      liked_user_id
    }
  }
`;

const DELETE_LIKE_MUTATION = gql`
  mutation DeleteLike($likerId: uuid!, $likedUserId: uuid!) {
    delete_likes(
      where: {
        _and: {
          liker_id: { _eq: $likerId }
          liked_user_id: { _eq: $likedUserId }
        }
      }
    ) {
      affected_rows
    }
  }
`;

export const useLikeUser = () => {
  const [insertLike, { error: insertError }] = useMutation(INSERT_LIKE_MUTATION);
  const [deleteLike, { error: deleteError }] = useMutation(DELETE_LIKE_MUTATION);

  const likeUser = async (currentUserId: string, targetUserId: string) => {
    await insertLike({
      variables: {
        likerId: currentUserId,
        likedUserId: targetUserId,
      },
    });
    if (insertError) {
      throw new Error(`Failed to like user: ${insertError.message}`);
    }
  };

  const unlikeUser = async (currentUserId: string, targetUserId: string) => {
    await deleteLike({
      variables: {
        likerId: currentUserId,
        likedUserId: targetUserId,
      },
    });
    if (deleteError) {
      throw new Error(`Failed to unlike user: ${deleteError.message}`);
    }
  };

  return { likeUser, unlikeUser };
};
