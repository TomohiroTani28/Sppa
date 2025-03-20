// src/types/error-log.ts

// Instead of using the UUID type, use string for compatibility
export type ErrorLog = {
  id?: string;  // Made optional for creation
  error_type: string;
  message: string;
  stack_trace?: string | null;
  user_id?: string | null;
  request_details?: any | null;
  created_at?: string;  // Made optional for creation
};

// Additional type for creating error logs without requiring all fields
export type ErrorLogCreateInput = {
  error_type: string;
  message: string;
  stack_trace?: string;
  user_id?: string;
  request_details?: any;
};