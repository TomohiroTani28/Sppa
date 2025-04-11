"use client";
// src/hooks/api/useErrorLogApi.ts
import { getClient } from "@/lib/hasura-client";
import { gql } from "@apollo/client";
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

const CREATE_ERROR_LOG_MUTATION = gql`
  mutation CreateErrorLog(
    $errorType: String!
    $message: String!
    $stackTrace: String
    $userId: uuid
    $requestDetails: jsonb
  ) {
    insert_error_logs_one(
      object: {
        error_type: $errorType
        message: $message
        stack_trace: $stackTrace
        user_id: $userId
        request_details: $requestDetails
      }
    ) {
      id
      created_at
    }
  }
`;

export type ErrorLogCreateInput = {
  error_type: string;
  message: string;
  stack_trace?: string;
  user_id?: string;
  request_details?: Record<string, any>;
};

export type ErrorLog = {
  id: string;
  created_at: string;
};

export const useErrorLogApi = (): {
  createErrorLog: (errorLog: ErrorLogCreateInput) => void;
  isLoading: boolean;
  error: Error | null;
} => {
  const createErrorLog = async (
    errorLog: ErrorLogCreateInput
  ): Promise<ErrorLog> => {
    try {
      // クライアントを非同期で直接取得
      const client = await getClient();
      
      const response = await client.mutate({
        mutation: CREATE_ERROR_LOG_MUTATION,
        variables: {
          errorType: errorLog.error_type,
          message: errorLog.message,
          stackTrace: errorLog.stack_trace ?? null,
          userId: errorLog.user_id ?? null,
          requestDetails: errorLog.request_details ?? null,
        },
      });
      return response.data.insert_error_logs_one;
    } catch (error) {
      console.error("Error creating error log:", error);
      throw error;
    }
  };

  const {
    mutate,
    status,
    error,
  }: UseMutationResult<ErrorLog, Error, ErrorLogCreateInput> = useMutation({
    mutationFn: createErrorLog,
    onError: (error) => {
      console.error("Error creating error log:", error);
    },
  });

  return { createErrorLog: mutate, isLoading: status === "pending", error };
};