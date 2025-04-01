// src/backend/api/graphql/availability.ts
import { gql } from "@apollo/client";
import graphqlClient from "@/lib/hasura-client";
import type { TherapistAvailability } from "@/types/availability";

// Update therapist availability
export const updateAvailability = async (therapistId: string, workingHours: any) => {
  const query = gql`
    mutation($therapistId: uuid!, $workingHours: jsonb!) {
      update_therapist_profiles(
        where: { user_id: { _eq: $therapistId } }
        _set: { working_hours: $workingHours }
      ) {
        returning {
          id
          working_hours
        }
      }
    }
  `;

  const variables = { therapistId, workingHours };

  const result = await graphqlClient.mutate({
    mutation: query,
    variables,
  });

  return result.data.update_therapist_profiles.returning[0];
};

// Fetch therapist availability
export const getAvailability = async (therapistId: string): Promise<TherapistAvailability | null> => {
  const query = gql`
    query($therapistId: uuid!) {
      therapist_profiles(where: { user_id: { _eq: $therapistId } }) {
        id
        working_hours
      }
    }
  `;

  const variables = { therapistId };

  const result = await graphqlClient.query({
    query,
    variables,
  });

  const workingHours = result.data.therapist_profiles[0]?.working_hours;
  return workingHours ? (workingHours as TherapistAvailability) : null;
};
