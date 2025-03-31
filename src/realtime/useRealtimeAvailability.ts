// src/realtime/useRealtimeAvailability.ts
import { useState, useEffect } from "react";
import { gql, useSubscription, useQuery } from "@apollo/client";

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

// 初期データ取得用クエリ
const GET_THERAPIST_STATUS = gql`
  query GetTherapistStatus($therapistId: ID!) {
    therapistProfile(therapistId: $therapistId) {
      id
      status
      lastOnlineAt
    }
  }
`;

/**
 * セラピストのリアルタイムアベイラビリティを取得するカスタムフック
 */
export const useRealtimeAvailability = (therapistId: string) => {
  const [status, setStatus] = useState<string>("offline");
  const [lastOnlineAt, setLastOnlineAt] = useState<string | null>(null);

  // 初期データ取得
  const {
    data: initialData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_THERAPIST_STATUS, {
    variables: { therapistId },
    skip: !therapistId,
    fetchPolicy: "cache-first", // 一度だけ読み込み、キャッシュがある場合はそれを使用
  });

  // リアルタイムサブスクリプション
  const {
    data: subscriptionData,
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription(THERAPIST_STATUS_SUBSCRIPTION, {
    variables: { therapistId },
    skip: !therapistId,
  });

  // 初期データが取得できたときにステータスを更新
  useEffect(() => {
    if (initialData?.therapistProfile) {
      setStatus(initialData.therapistProfile.status);
      setLastOnlineAt(initialData.therapistProfile.lastOnlineAt);
    }
  }, [initialData]);

  // リアルタイムデータが更新されたときにステータスを更新
  useEffect(() => {
    if (subscriptionData?.therapistStatus) {
      setStatus(subscriptionData.therapistStatus.status);
      setLastOnlineAt(subscriptionData.therapistStatus.lastOnlineAt);
    }
  }, [subscriptionData]);

  return {
    status,
    lastOnlineAt,
    isLoading: queryLoading || subscriptionLoading,
    error: queryError || subscriptionError,
  };
};
