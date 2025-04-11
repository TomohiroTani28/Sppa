// src/lib/error-handler.ts - 集中エラーハンドリング
export class AppError extends Error {
  code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'AppError';
  }
}

export function handleGraphQLError(error: any, defaultMessage = 'An error occurred') {
  // GraphQL特有のエラー情報を抽出
  const graphQLErrors = error?.graphQLErrors || [];
  const networkError = error?.networkError;
  
  // エラーをログに記録
  console.error('GraphQL Error:', {
    graphQLErrors,
    networkError,
    message: error?.message,
    stack: error?.stack,
  });
  
  // ユーザーフレンドリーなメッセージを作成
  if (graphQLErrors.length > 0) {
    const firstError = graphQLErrors[0];
    const code = firstError.extensions?.code || 'GRAPHQL_ERROR';
    
    if (code === 'UNAUTHENTICATED') {
      return new AppError('Authentication required. Please sign in.', 'AUTH_REQUIRED');
    }
    
    if (code === 'FORBIDDEN') {
      return new AppError('You do not have permission to perform this action.', 'FORBIDDEN');
    }
    
    return new AppError(firstError.message || defaultMessage, code);
  }
  
  if (networkError) {
    return new AppError('Network error. Please check your connection.', 'NETWORK_ERROR');
  }
  
  return new AppError(error?.message || defaultMessage, 'UNKNOWN_ERROR');
} 