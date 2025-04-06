// src/hooks/api/useActivityLogging.ts
import { useCallback } from "react";
import { useMutation, gql } from "@apollo/client";
import { useErrorLogApi } from "./useErrorLogApi";
import { validate as uuidValidate } from "uuid";

// 認証状態の型を定義
interface AuthState {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

const INSERT_ACTIVITY_LOG = gql`
  mutation InsertActivityLog(
    $user_id: uuid!
    $activity_type: String!
    $description: String
    $request_details: jsonb
  ) {
    insert_activity_logs_one(
      object: {
        user_id: $user_id
        activity_type: $activity_type
        description: $description
        request_details: $request_details
      }
    ) {
      id
      created_at
    }
  }
`;

interface LogActivityParams {
  activityType: string;
  description?: string;
  requestDetails?: Record<string, any>;
}

export const useActivityLogging = (authState: AuthState | null) => {
  const { createErrorLog } = useErrorLogApi();

  const [insertActivityLog, { loading }] = useMutation(INSERT_ACTIVITY_LOG, {
    onError: (error) => {
      createErrorLog({
        error_type: "ACTIVITY_LOG_FAILURE",
        message: "Failed to log activity",
        stack_trace: error.message,
        request_details: {
          operation: "insertActivityLog",
          errorMessage: error.message,
        },
      });
      console.error("Failed to log activity:", error);
    },
  });

  const logActivity = useCallback(
    async ({ activityType, description, requestDetails }: LogActivityParams) => {
      if (!authState?.user?.id || !uuidValidate(authState.user.id)) {
        console.warn("Invalid or missing user ID for logging activity");
        await createErrorLog({
          error_type: "MISSING_USER_ID",
          message: "Attempted to log activity without valid user ID",
          request_details: { activityType, description, requestDetails },
        });
        return;
      }
      try {
        await insertActivityLog({
          variables: {
            user_id: authState.user.id,
            activity_type: activityType,
            description: description || null,
            request_details: requestDetails || null,
          },
        });
      } catch (error) {
        // Errors are handled by onError handler
      }
    },
    [authState, insertActivityLog, createErrorLog]
  );

  const logPageView = useCallback(
    (pageName: string, additionalDetails?: Record<string, any>) => {
      return logActivity({
        activityType: "page_view",
        description: `Viewed ${pageName} page`,
        requestDetails: {
          page: pageName,
          timestamp: new Date().toISOString(),
          ...additionalDetails,
        },
      });
    },
    [logActivity]
  );

  return {
    logActivity,
    logPageView,
    loading,
  };
};

export default useActivityLogging;