// src/hooks/useWebSocketSubscription.ts
"use client";
import { useEffect, useState } from "react";
import { createClient } from "graphql-ws";
import { print } from "graphql";
import type { DocumentNode } from "graphql";

interface SubscriptionOptions<T> {
  query: DocumentNode;
  variables?: Record<string, any>;
  onData?: (data: T) => void;
}

export function useWebSocketSubscription<T = any>({
  query,
  variables,
  onData,
}: SubscriptionOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // SSRのときはスキップ
    if (typeof window === "undefined") return;
    setLoading(true);
    // WebSocket クライアントの生成（wsに修正）
    const client = createClient({
      url:
        process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT ||
        "ws://localhost:8081/v1/graphql",
      connectionParams: {
        headers: {
          "x-hasura-admin-secret":
            process.env.HASURA_GRAPHQL_ADMIN_SECRET || "",
        },
      },
    });

    const unsubscribe = client.subscribe(
      {
        query: print(query),
        variables,
      },
      {
        next: (result) => {
          if (result.data) {
            setData(result.data as T);
            onData?.(result.data as T);
          }
          setLoading(false);
        },
        error: (err) => {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        },
        complete: () => {
          setLoading(false);
        },
      }
    );

    return () => {
      unsubscribe();
    };
  }, [query, variables, onData]);

  return { data, loading, error };
}
