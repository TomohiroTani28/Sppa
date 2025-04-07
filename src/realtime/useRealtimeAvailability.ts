// src/realtime/useRealtimeAvailability.ts
import { gql, useSubscription } from "@apollo/client";
import { useState } from "react";

// セラピストのステータスをリアルタイム監視するサブスクリプション
const THERAPIST_STATUS_SUBSCRIPTION = gql`
  subscription TherapistStatusSubscription($therapistId: ID!) {
    therapistStatus(therapistId: $therapistId) {
      id
      status
      lastOnlineAt
    }
  }
`;

/**
 * セラピストのリアルタイムアベイラビリティを取得するカスタムフック
 * @param therapistIds 監視するセラピストIDの配列
 */
export const useRealtimeAvailability = (therapistIds: string[]) => {
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});
  const [lastOnlineMap, setLastOnlineMap] = useState<Record<string, string | null>>({});

  // 各セラピストIDに対してサブスクリプションを設定
  therapistIds.forEach((therapistId) => {
    const { data } = useSubscription(THERAPIST_STATUS_SUBSCRIPTION, {
      variables: { therapistId },
      skip: !therapistId,
      onData: ({ data }) => {
        if (data?.data?.therapistStatus) {
          const { id, status, lastOnlineAt } = data.data.therapistStatus;
          setAvailabilityMap((prev) => ({
            ...prev,
            [id]: status === "online",
          }));
          setLastOnlineMap((prev) => ({
            ...prev,
            [id]: lastOnlineAt,
          }));
        }
      },
    });
  });

  // 新しいセラピストIDを追加する関数
  const subscribeToAvailability = (therapistId: string) => {
    if (!therapistIds.includes(therapistId)) {
      setAvailabilityMap((prev) => ({
        ...prev,
        [therapistId]: false,
      }));
    }
  };

  return {
    availabilityMap,
    lastOnlineMap,
    subscribeToAvailability,
  };
};
