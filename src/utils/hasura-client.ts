// src/utils/hasura-client.ts
import { getAuthToken } from '@/utils/auth';
import { GraphQLClient } from 'graphql-request';
import { Client, createClient } from 'graphql-ws';
import WebSocket from 'ws';

const HASURA_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT || 'http://localhost:8081/v1/graphql';
const HASURA_WS_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT || 'ws://localhost:8081/v1/graphql';
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

export const hasuraClient = async (customHeaders: Record<string, string> = {}) => {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {
          'x-hasura-admin-secret': HASURA_ADMIN_SECRET ?? throwErrorIfUndefined(),
        }),
    ...customHeaders,
  };
  return new GraphQLClient(HASURA_GRAPHQL_ENDPOINT, { headers });
};

const throwErrorIfUndefined = (): never => {
  throw new Error('HASURA_ADMIN_SECRET is not defined in environment variables');
};

export const hasuraSubscriptionClient = async (): Promise<Client> => {
  const token = await getAuthToken();
  return createClient({
    url: HASURA_WS_ENDPOINT,
    webSocketImpl: WebSocket,
    connectionParams: {
      headers: {
        'Content-Type': 'application/json',
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {
              'x-hasura-admin-secret': HASURA_ADMIN_SECRET ?? throwErrorIfUndefined(),
            }),
      },
    },
  });
};

export const subscribeToHasura = async <T>(
  query: string,
  variables: Record<string, any>,
  onData: (data: T) => void,
  onError?: (error: any) => void
): Promise<() => void> => {
  const client = await hasuraSubscriptionClient();
  const unsubscribe = client.subscribe<T>(
    { query, variables },
    {
      next: ({ data }) => data && onData(data),
      error: (error) => onError?.(error),
      complete: () => console.log('Subscription completed'),
    }
  );
  return unsubscribe;
};

export const fetchFromHasura = async <T>(
  query: string,
  variables: Record<string, any> = {},
  headers: Record<string, string> = {}
): Promise<T> => {
  try {
    const client = await hasuraClient(headers);
    return await client.request<T>(query, variables);
  } catch (error) {
    console.error('Hasura query error:', error);
    throw error;
  }
};
