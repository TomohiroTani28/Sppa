// src/app/lib/queries/therapistAvailability.ts
import { gql } from "@apollo/client";

export const GET_THERAPIST_AVAILABILITY = gql`
  query GetTherapistAvailability($therapistId: uuid!) {
    api_therapist_availability(where: { therapist_id: { _eq: $therapistId } }) {
      id
      therapist_id
      start_time
      end_time
      is_available
      updated_at
    }
  }
`;

export const AVAILABILITY_SUBSCRIPTION = gql`
  subscription OnAvailabilityUpdated($therapistId: uuid!) {
    api_therapist_availability(where: { therapist_id: { _eq: $therapistId } }) {
      id
      therapist_id
      start_time
      end_time
      is_available
      updated_at
    }
  }
`;
