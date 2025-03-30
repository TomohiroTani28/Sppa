// src/app/create-ws-client.ts
import { createClient } from "graphql-ws";

export function createWsClient() {
  if (typeof window === "undefined") return null;
  const wsEndpoint = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT;
  if (!wsEndpoint) {
    throw new Error(
      "WebSocket Endpoint is not defined. Check your .env.local file."
    );
  }

  return createClient({
    url: wsEndpoint,
    connectionParams: {
      headers: {
        "x-hasura-admin-secret":
          process.env.HASURA_GRAPHQL_ADMIN_SECRET || "",
        "x-hasura-role": "tourist",
      },
    },
  });
}