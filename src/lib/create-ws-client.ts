// src/lib/create-ws-client.ts
import { createClient } from "graphql-ws";

export function createWsClient(token?: string, role: string = "tourist") {
  if (typeof window === "undefined") return null;

  const wsEndpoint = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT;
  const adminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

  if (!wsEndpoint || !adminSecret) {
    console.error("Missing environment variables for WebSocket connection:", {
      wsEndpoint: wsEndpoint || "undefined",
      adminSecret: adminSecret || "undefined",
    });
    throw new Error("WebSocket configuration is incomplete. Check NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT and HASURA_GRAPHQL_ADMIN_SECRET.");
  }

  const headers = {
    "x-hasura-role": role,
    "x-hasura-admin-secret": adminSecret,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  console.log("WebSocket Connection Headers:", headers);

  return createClient({
    url: wsEndpoint,
    connectionParams: { headers },
  });
}