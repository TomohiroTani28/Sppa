// src/realtime/useTherapistAvailability.ts
import { useEffect, useState } from "react";
import { gql, useSubscription } from "@apollo/client";
import { TherapistStatus } from "@/types/therapist";

/**
 * therapist_profiles テーブルから、user_id と status を購読
 * @param therapistIds user_id の配列
 */

const THERAPIST_STATUS_SUBSCRIPTION = gql`
  subscription TherapistStatusSubscription($therapistIds: [uuid!]!) {
    therapist_profiles(where: { user_id: { _in: $therapistIds } }) {
      user_id
      status
    }
  }
`;

type AvailabilityStatus = {
  status: TherapistStatus; // "online" | "offline" | "busy" | "vacation" など
};

type AvailabilityStatuses = {
  [therapistId: string]: AvailabilityStatus;
};

export function useTherapistAvailability(therapistIds: string[]) {
  const [availabilityStatuses, setAvailabilityStatuses] =
    useState<AvailabilityStatuses>({});

  // therapistIds が空のときは購読をスキップ
  const skipSubscription = !therapistIds || therapistIds.length === 0;

  // サブスクリプションフック
  const { data, error } = useSubscription(THERAPIST_STATUS_SUBSCRIPTION, {
    variables: { therapistIds },
    skip: skipSubscription,
  });

  useEffect(() => {
    // therapist_profiles のデータが更新されるたびに反映
    if (data?.therapist_profiles) {
      const newStatuses: AvailabilityStatuses = {};

      data.therapist_profiles.forEach(
        (profile: { user_id: string; status: TherapistStatus }) => {
          newStatuses[profile.user_id] = { status: profile.status };
        },
      );

      setAvailabilityStatuses(newStatuses);
    }
  }, [data]);

  // エラーハンドリング（必要に応じてロジック追加）
  useEffect(() => {
    if (error) {
      console.error("useTherapistAvailability subscription error:", error);
    }
  }, [error]);

  return {
    availabilityStatuses, // { [therapistId]: { status: 'online' | ... }, ... }
    error,
  };
}
