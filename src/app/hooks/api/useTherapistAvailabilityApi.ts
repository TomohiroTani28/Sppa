"use client";
// src/app/hooks/api/useTherapistAvailabilityApi.ts
import { useCallback } from "react";
import { gql } from "@apollo/client";
import client from "@/app/lib/hasura-client";
import {
  GET_THERAPIST_AVAILABILITY,
  AVAILABILITY_SUBSCRIPTION,
} from "@/app/lib/queries/therapistAvailability";
import { TherapistAvailabilitySlot } from "@/types/availability";

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
    const { data } = await client.query({
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
    const observable = client.subscribe({
      query: AVAILABILITY_SUBSCRIPTION,
      variables: { therapistId },
    });
    const subscription = observable.subscribe({
      next: (resp) => {
        const newSlots = resp?.data?.therapist_availability || [];
        onUpdate(newSlots);
      },
      error: (err) => {
        console.error("Subscription error:", err);
      },
    });
    // 戻り値として購読停止関数を返す
    return () => subscription.unsubscribe();
  };

  return {
    fetchAvailability,
    subscribeToAvailability,
  };
}
