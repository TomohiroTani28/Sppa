// src/app/hooks/api/useActivityLogging.ts
import { useCallback } from "react";
import { useMutation, gql } from "@apollo/client";
import { useAuth } from "./useAuth";
import { useErrorLogApi } from "./useErrorLogApi";
import { validate as uuidValidate } from "uuid";

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

export const useActivityLogging = () => {
  const { user } = useAuth();
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
      if (!user?.id || !uuidValidate(user.id)) {
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
            user_id: user.id,
            activity_type: activityType,
            description: description || null,
            request_details: requestDetails || null,
          },
        });
      } catch (error) {
        // Errors are handled by onError handler
      }
    },
    [user, insertActivityLog, createErrorLog]
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