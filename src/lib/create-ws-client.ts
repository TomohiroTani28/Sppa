// src/lib/create-ws-client.ts
import { createClient, Client } from "graphql-ws";

// インスタンスの型を定義
interface WsClientInstance {
  client: Client;
  token: string | undefined;
}

// シングルトンインスタンスを保持（型を明示）
let wsClientInstance: WsClientInstance | null = null;

export function createWsClient(token?: string): Client | null {
  if (typeof window === "undefined") return null;

  // 既存のクライアントがあればそれを返す（同じトークンの場合）
  if (wsClientInstance && wsClientInstance.token === token) {
    return wsClientInstance.client;
  }

  const wsEndpoint = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT;

  if (!wsEndpoint) {
    console.error("WebSocket Endpoint is missing");
    return null;
  }
  
  const connectionParams = {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  try {
    // 新しいクライアントを作成
    const client = createClient({
      url: wsEndpoint,
      connectionParams,
    });

    // シングルトンとして保存
    wsClientInstance = {
      client,
      token
    };

    return client;
  } catch (error) {
    console.error("WebSocket initialization error");
    return null;
  }
}