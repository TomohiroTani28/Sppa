// src/lib/create-ws-client.ts
import { createClient } from "graphql-ws";

export function createWsClient(token?: string) {
  if (typeof window === "undefined") return null;

  const wsEndpoint = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT;
  console.log("WebSocket Endpoint:", wsEndpoint);

  if (!wsEndpoint) {
    console.error("WebSocket Endpoint is not defined:", {
      wsEndpoint: wsEndpoint || "undefined",
    });
    throw new Error("NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT is missing.");
  }
  const connectionParams = {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  console.log("WebSocket Connection Params:", connectionParams);

  return createClient({
    url: wsEndpoint,
    connectionParams,
  });
}