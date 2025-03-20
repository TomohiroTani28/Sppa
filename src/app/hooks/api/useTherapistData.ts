// src/app/hooks/api/useTherapistData.ts
import { gql, useQuery } from "@apollo/client";
import { graphqlClient } from "@/app/lib/hasura-client";

const THERAPIST_QUERY = gql`
  query TherapistProfiles($userId: String!) {
    therapist_profiles(where: { user_id: { _eq: $userId } }) {
      id
      user_id
      bio
      user {
        id
        name
        profile_picture
        role
      }
    }
  }
`;

export const useTherapistData = (
  userId: string,
  authLoading: boolean,
  role?: "therapist" | "tourist"
) => {
  const { data, loading, error } = useQuery(THERAPIST_QUERY, {
    variables: { userId },
    skip: !userId || userId === "" || authLoading || role !== "therapist", // ロールが 'therapist' でない場合スキップ
    onError: async (err) => {
      console.error("Therapist Data Error:", {
        message: err.message,
        graphQLErrors: err.graphQLErrors?.map((e) => ({
          message: e.message,
          path: e.path,
        })),
        networkError: err.networkError ? err.networkError.message : null,
      });
      // エラーログを Hasura に送信
      try {
        await graphqlClient.mutate({
          mutation: gql`
            mutation LogError($userId: UUID, $errorType: String!, $message: String!, $stackTrace: String) {
              insert_error_logs_one(object: {
                user_id: $userId,
                error_type: $errorType,
                message: $message,
                stack_trace: $stackTrace
              }) {
                id
              }
            }
          `,
          variables: {
            userId,
            errorType: "TherapistQueryError",
            message: err.message,
            stackTrace: err.stack || null,
          },
        });
      } catch (logError) {
        console.error("エラーログの記録に失敗:", logError);
      }
    },
    onCompleted: (data) => {
      console.log("Therapist Query Completed:", data?.therapist_profiles || []);
    },
  });

  return {
    therapistData: data?.therapist_profiles || [],
    loading,
    error,
  };
};

export default useTherapistData;