"use client";
// src/app/hooks/realtime/useTherapistAvailability.ts
import { useCallback } from "react";
import { gql } from "@apollo/client";
import client from "@/app/lib/hasura-client";
import { TherapistAvailabilitySlot } from "@/types/availability";

const GET_THERAPIST_AVAILABILITY = gql`
  query GetTherapistAvailability($therapistId: String!) {
    therapist_availability(where: { therapist_id: { _eq: $therapistId } }) {
      id
      therapist_id
      start_time
      end_time
      is_available
    }
  }
`;

const AVAILABILITY_SUBSCRIPTION = gql`
  subscription AvailabilitySubscription($therapistId: String!) {
    therapist_availability(where: { therapist_id: { _eq: $therapistId } }) {
      id
      therapist_id
      start_time
      end_time
      is_available
    }
  }
`;

export function useTherapistAvailabilityApi(therapistId?: string) {
  const fetchAvailability = useCallback(async () => {
    if (!therapistId) return { available_slots: [] };
    const { data } = await client.query({
      query: GET_THERAPIST_AVAILABILITY,
      variables: { therapistId },
      fetchPolicy: "network-only",
    });

    const slots: TherapistAvailabilitySlot[] = data?.therapist_availability ?? [];
    return { available_slots: slots };
  }, [therapistId]);

  const subscribeToAvailability = (onUpdate: (slots: TherapistAvailabilitySlot[]) => void) => {
    if (!therapistId) return () => {};
    const observable = client.subscribe({
      query: AVAILABILITY_SUBSCRIPTION,
      variables: { therapistId },
    });
    const subscription = observable.subscribe({
      next: (resp) => {
        const newSlots = resp?.data?.therapist_availability || [];
        onUpdate(newSlots);
      },
      error: (err) => console.error("Subscription error:", err),
    });
    return () => subscription.unsubscribe();
  };

  return { fetchAvailability, subscribeToAvailability };
}