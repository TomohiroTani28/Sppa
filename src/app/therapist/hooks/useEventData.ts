// src/app/(therapist)/hooks/useEventData.ts
import { useQuery } from "@apollo/client";
import { GET_EVENTS } from "@/queries/getEvents";

export const useEventData = (therapistId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_EVENTS, {
    variables: { therapistId },
  });

  return { data, loading, error, refetch };
};