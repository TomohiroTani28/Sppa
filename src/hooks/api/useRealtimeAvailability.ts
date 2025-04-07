// src/hooks/api/useRealtimeAvailability.ts
import { gql, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";

const AVAILABILITY_SUBSCRIPTION = gql`
  subscription OnTherapistAvailabilityChange($therapistId: ID!) {
    therapistAvailabilityChange(therapistId: $therapistId) {
      therapistId
      isAvailable
    }
  }
`;

export const useRealtimeAvailability = (therapistIds: string[]) => {
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const subscriptions = therapistIds.map((therapistId) => {
      const { data } = useSubscription(AVAILABILITY_SUBSCRIPTION, {
        variables: { therapistId },
        onData: ({ data }) => {
          if (data?.data?.therapistAvailabilityChange) {
            const { therapistId, isAvailable } = data.data.therapistAvailabilityChange;
            setAvailabilityMap((prev) => ({
              ...prev,
              [therapistId]: isAvailable,
            }));
          }
        },
      });
      return data;
    });

    return () => {
      // Apollo Client automatically handles subscription cleanup
      // when the component unmounts or the effect cleanup runs
    };
  }, [therapistIds]);

  return {
    availabilityMap,
    subscribeToAvailability: (therapistId: string) => {
      if (!therapistIds.includes(therapistId)) {
        setAvailabilityMap((prev) => ({
          ...prev,
          [therapistId]: false,
        }));
      }
    },
  };
};