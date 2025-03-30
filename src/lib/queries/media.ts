// src/app/lib/queries/media.ts
import { gql } from "@apollo/client";

export const MEDIA_SUBSCRIPTION = gql`
  subscription OnMediaUpdated($therapistId: uuid!) {
    api_media(
      where: { therapist_id: { _eq: $therapistId } }
      order_by: { created_at: desc }
    ) {
      id
      url
      media_type
      caption
      created_at
    }
  }
`;
