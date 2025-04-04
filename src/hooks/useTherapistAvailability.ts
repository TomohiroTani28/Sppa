// src/hooks/useTherapistAvailability.ts

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import type { TherapistAvailability } from "@/types/availability";

const GET_THERAPIST_AVAILABILITY = gql`
  query GetTherapistAvailability($therapistId: UUID!) {
    therapist_availability(where: { therapist_id: { _eq: $therapistId } }) {
      id
      start_time
      end_time
      is_available
      updated_at
    }
  }
`;

export function useTherapistAvailability(therapistId: string) {
  const [availability, setAvailability] = useState<TherapistAvailability[]>([]);

  const { data, loading, error } = useQuery<{
    therapist_availability: TherapistAvailability[];
  }>(GET_THERAPIST_AVAILABILITY, {
    variables: { therapistId },
  });

  useEffect(() => {
    if (data?.therapist_availability) {
      setAvailability(data.therapist_availability);
    }
  }, [data]);

  const updateAvailability = (newAvailability: TherapistAvailability[]) => {
    setAvailability(newAvailability);
  };

  return { availability, updateAvailability, loading, error };
}