// src/app/hooks/api/useLikeTherapist.ts
import { useMutation, gql } from "@apollo/client";
import { FetchResult, ApolloError } from "@apollo/client";

const LIKE_THERAPIST = gql`
  mutation InsertLike($guestId: uuid!, $therapistId: uuid!) {
    insert_likes_one(
      object: { guest_id: $guestId, therapist_id: $therapistId }
    ) {
      id
      guest_id
      therapist_id
      created_at
      is_matched
      matched_at
    }
  }
`;

const UNLIKE_THERAPIST = gql`
  mutation DeleteLike($guestId: uuid!, $therapistId: uuid!) {
    delete_likes(
      where: {
        guest_id: { _eq: $guestId }
        therapist_id: { _eq: $therapistId }
      }
    ) {
      affected_rows
    }
  }
`;

interface LikeTherapistHookResult {
  likeTherapist: (
    guestId: string,
    therapistId: string,
  ) => Promise<FetchResult<any>>;
  unlikeTherapist:
    | ((guestId: string, therapistId: string) => Promise<FetchResult<any>>)
    | null
    | undefined;
  likeData: any;
  unlikeData: any;
  loading: boolean;
  error: ApolloError | undefined;
  unlikeLoading: boolean;
  unlikeError: ApolloError | undefined;
}

export const useLikeTherapist = (): LikeTherapistHookResult => {
  const [likeMutation, { data: likeData, loading, error }] =
    useMutation(LIKE_THERAPIST);
  const [
    unlikeMutation,
    { data: unlikeData, loading: unlikeLoading, error: unlikeError },
  ] = useMutation(UNLIKE_THERAPIST);

  const likeTherapist = async (
    guestId: string,
    therapistId: string,
  ): Promise<FetchResult<any>> => {
    return await likeMutation({
      variables: {
        guestId,
        therapistId,
      },
    });
  };

  const unlikeTherapist = async (
    guestId: string,
    therapistId: string,
  ): Promise<FetchResult<any>> => {
    return await unlikeMutation({
      variables: {
        guestId,
        therapistId,
      },
    });
  };

  return {
    likeTherapist,
    unlikeTherapist,
    likeData,
    unlikeData,
    loading,
    error,
    unlikeLoading,
    unlikeError,
  };
};
