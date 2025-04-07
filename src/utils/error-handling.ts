import { ApolloError } from '@apollo/client';

export type ErrorType = 
  | 'NETWORK_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  originalError?: unknown;
}

export const createAppError = (error: unknown): AppError => {
  if (error instanceof ApolloError) {
    if (error.networkError) {
      return {
        type: 'NETWORK_ERROR',
        message: 'ネットワーク接続に問題が発生しました。',
        originalError: error,
      };
    }

    const graphQLError = error.graphQLErrors[0];
    if (graphQLError) {
      if (graphQLError.extensions?.code === 'UNAUTHENTICATED') {
        return {
          type: 'AUTHENTICATION_ERROR',
          message: '認証が必要です。再度ログインしてください。',
          code: graphQLError.extensions.code,
          originalError: error,
        };
      }
      if (graphQLError.extensions?.code === 'FORBIDDEN') {
        return {
          type: 'AUTHORIZATION_ERROR',
          message: 'この操作を実行する権限がありません。',
          code: graphQLError.extensions.code,
          originalError: error,
        };
      }
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('not found')) {
      return {
        type: 'NOT_FOUND',
        message: '要求されたリソースが見つかりませんでした。',
        originalError: error,
      };
    }
    if (error.message.includes('validation')) {
      return {
        type: 'VALIDATION_ERROR',
        message: '入力データが正しくありません。',
        originalError: error,
      };
    }
  }

  return {
    type: 'UNKNOWN_ERROR',
    message: 'エラーが発生しました。',
    originalError: error,
  };
};

export const handleApiError = (error: unknown): AppError => {
  const appError = createAppError(error);
  
  // エラーをログに記録
  console.error('[API Error]', {
    type: appError.type,
    message: appError.message,
    code: appError.code,
    originalError: appError.originalError,
  });

  return appError;
};

export const isNetworkError = (error: AppError): boolean => {
  return error.type === 'NETWORK_ERROR';
};

export const isAuthenticationError = (error: AppError): boolean => {
  return error.type === 'AUTHENTICATION_ERROR';
};

export const isAuthorizationError = (error: AppError): boolean => {
  return error.type === 'AUTHORIZATION_ERROR';
}; 