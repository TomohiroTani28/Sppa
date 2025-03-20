// src/app/hooks/api/useMedia.ts
import { useQuery } from "@tanstack/react-query";

// mediaの取得API
async function fetchMedia(therapistId: string) {
  const query = `
    query GetMedia($therapistId: uuid!) {
      media(where: {therapist_id: { _eq: $therapistId }}) {
        id
        media_type
        url
        caption
        created_at
      }
    }
  `;
  const response = await fetch("/api/hasura", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { therapistId },
    }),
  });
  const data = await response.json();
  return data.data.media;
}

export const useMedia = (therapistId: string) => {
  return useQuery({
    queryKey: ["media", therapistId],
    queryFn: () => fetchMedia(therapistId),
    enabled: !!therapistId,
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });
};