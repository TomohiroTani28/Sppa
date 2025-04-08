// src/queries/getEvents.ts
import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
  query GetEvents($therapistId: uuid!) {
    events(where: { therapist_id: { _eq: $therapistId } }) {
      id
      title
      description
      start_date
      end_date
      discount_percentage
      promotion_code
      is_active
      created_at
      updated_at
    }
  }
`;