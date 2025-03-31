// src/app/(therapist)/hooks/useActivityLogs.ts
import { useQuery, gql } from "@apollo/client";
import { useUser } from "@/hooks/api/useUser";

const GET_ACTIVITY_LOGS = gql`
  query GetActivityLogs($userId: uuid!) {
    activity_logs(where: { user_id: { _eq: $userId } }) {
      id
      activity_type
      description
      activity_date
    }
  }
`;

export const useActivityLogs = (userId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_ACTIVITY_LOGS, {
    variables: { userId },
  });
  return { data, loading, error, refetch };
};
