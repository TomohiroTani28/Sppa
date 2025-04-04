// src/lib/create-ws-client.ts
import { createClient } from "graphql-ws";

export function createWsClient(token?: string, role: string = "tourist") {
  if (typeof window === "undefined") return null;

  const wsEndpoint = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT;
  if (!wsEndpoint) {
    console.error("WebSocket Endpoint is not defined:", {
      wsEndpoint: wsEndpoint || "undefined",
    });
    throw new Error("NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT is missing.");
  }

  const headers = {
    "x-hasura-role": role,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  console.log("WebSocket Connection Headers:", headers);

  return createClient({
    url: wsEndpoint,
    connectionParams: { headers },
  });
}