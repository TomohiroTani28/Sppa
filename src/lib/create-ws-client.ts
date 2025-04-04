// src/lib/create-ws-client.ts
import { createClient } from "graphql-ws";

export function createWsClient(token?: string, role: string = "tourist") {
  // Prevent execution on server-side rendering
  if (typeof window === "undefined") return null;

  // Use the public WebSocket endpoint from environment variables
  const wsEndpoint = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT;
  if (!wsEndpoint) {
    console.error("WebSocket Endpoint is not defined:", {
      wsEndpoint: wsEndpoint || "undefined",
    });
    throw new Error("NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT is missing.");
  }

  // Set headers with role and token (if available)
  const headers = {
    "x-hasura-role": role,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  console.log("WebSocket Connection Headers:", headers);

  // Create and return the WebSocket client
  return createClient({
    url: wsEndpoint,
    connectionParams: { headers },
  });
}