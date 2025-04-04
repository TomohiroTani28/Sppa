// src/backend/api/graphql/availability.ts
import { gql } from "@apollo/client";
import getGraphqlClient from "@/lib/hasura-client"; // Renamed to reflect it's a function
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

  // Call the function to get the ApolloClient instance
  const client = await getGraphqlClient();
  const result = await client.mutate({
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

  // Call the function to get the ApolloClient instance
  const client = await getGraphqlClient();
  const result = await client.query({
    query,
    variables,
  });

  const workingHours = result.data.therapist_profiles[0]?.working_hours;
  return workingHours ? (workingHours as TherapistAvailability) : null;
};