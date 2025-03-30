// src/app/hooks/api/useRealtimeAvailability.ts
import { useState, useEffect } from "react";
import { gql, useSubscription } from "@apollo/client";

const THERAPIST_STATUS_SUBSCRIPTION = gql`
  subscription TherapistStatusSubscription($therapistId: ID!) {
    therapistStatus(therapistId: $therapistId) {
      id
      status
      lastOnlineAt
    }
  }
`;

const GET_THERAPIST_STATUS = gql`
  query GetTherapistStatus($therapistId: ID!) {
    therapistProfile(therapistId: $therapistId) {
      id
      status
      lastOnlineAt
    }
  }
`;

export const useRealtimeAvailability = () => {
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});
  const [lastOnlineMap, setLastOnlineMap] = useState<Record<string, string | null>>({});
  const [subscribedTherapists, setSubscribedTherapists] = useState<Set<string>>(new Set());

  const subscribeToAvailability = (therapistId: string) => {
    if (!subscribedTherapists.has(therapistId)) {
      setSubscribedTherapists((prev) => new Set(prev).add(therapistId));
    }
  };

  // 各セラピストごとにサブスクリプションを設定
  subscribedTherapists.forEach((therapistId) => {
    useSubscription(THERAPIST_STATUS_SUBSCRIPTION, {
      variables: { therapistId },
      skip: !therapistId,
      onData: ({ data }) => {
        const therapistStatus = data?.data?.therapistStatus;
        if (therapistStatus) {
          setAvailabilityMap((prev) => ({
            ...prev,
            [therapistId]: therapistStatus.status === "online",
          }));
          setLastOnlineMap((prev) => ({
            ...prev,
            [therapistId]: therapistStatus.lastOnlineAt,
          }));
        }
      },
    });
  });

  return {
    availabilityMap,
    lastOnlineMap,
    subscribeToAvailability,
  };
};