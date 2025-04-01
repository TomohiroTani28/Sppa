// src/backend/api/graphql/error-logs.ts
import { gql } from '@apollo/client';

export const CREATE_ERROR_LOG_MUTATION = gql`
  mutation CreateErrorLog(
    $errorType: String!,
    $message: String!,
    $stackTrace: String,
    $userId: uuid,
    $requestDetails: jsonb
  ) {
    insert_error_logs_one(object: {
      error_type: $errorType,
      message: $message,
      stack_trace: $stackTrace,
      user_id: $userId,
      request_details: $requestDetails
    }) {
      id
      created_at
    }
  }
`;