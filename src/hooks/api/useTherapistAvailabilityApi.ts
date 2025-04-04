"use client";
// src/hooks/api/useTherapistAvailabilityApi.ts
import { useCallback } from "react";
import client from "@/lib/hasura-client";
import {
  GET_THERAPIST_AVAILABILITY,
  AVAILABILITY_SUBSCRIPTION,
} from "@/lib/queries/therapistAvailability";
import { TherapistAvailabilitySlot } from "@/types/availability";
import { FetchResult } from "@apollo/client";

// サブスクリプションのレスポンス型を定義
type TherapistAvailabilitySubscription = {
  therapist_availability: TherapistAvailabilitySlot[];
};

/**
 * テーブル: therapist_availability
 * - Hasura Query (初回フェッチ)
 * - Hasura Subscription (リアルタイム購読)
 */
export function useTherapistAvailabilityApi(therapistId?: string) {
  /**
   * 初回 / 手動 で行う Query Fetch
   */
  const fetchAvailability = useCallback(async () => {
    if (!therapistId) return { available_slots: [] };
    const apolloClient = await client();
    const { data } = await apolloClient.query({
      query: GET_THERAPIST_AVAILABILITY,
      variables: { therapistId },
      fetchPolicy: "network-only",
    });

    const slots: TherapistAvailabilitySlot[] =
      data?.therapist_availability ?? [];
    return { available_slots: slots };
  }, [therapistId]);

  /**
   * Subscription を開始し、更新が届くたびにコールバック onUpdate を呼ぶ
   * @param onUpdate (slots) => void
   * @returns unsubscribe 関数
   */
  const subscribeToAvailability = (
    onUpdate: (slots: TherapistAvailabilitySlot[]) => void,
  ) => {
    if (!therapistId) {
      return () => {};
    }
    client()
      .then((apolloClient) => {
        const observable = apolloClient.subscribe<TherapistAvailabilitySubscription>({
          query: AVAILABILITY_SUBSCRIPTION,
          variables: { therapistId },
        });
        const subscription = observable.subscribe({
          next: (resp: FetchResult<TherapistAvailabilitySubscription>) => {
            const newSlots = resp?.data?.therapist_availability || [];
            onUpdate(newSlots);
          },
          error: (err: Error) => {
            console.error("Subscription error:", err);
          },
        });
        // 戻り値として購読停止関数を返す
        return () => subscription.unsubscribe();
      })
      .catch((error) => {
        console.error("Failed to get Apollo Client:", error);
      });

    // 即座に購読停止関数を返す（必要に応じて）
    return () => {};
  };

  return {
    fetchAvailability,
    subscribeToAvailability,
  };
}