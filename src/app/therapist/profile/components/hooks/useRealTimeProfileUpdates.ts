// src/app/(therapist)/profile/components/hooks/useRealTimeProfileUpdates.ts
import { useSubscription } from '@apollo/client';
import { ON_THERAPIST_PROFILE_UPDATE } from '@/graphql/subscriptions'; // 修正
import { TherapistProfile } from '@/types/therapist';

/**
 * セラピストのプロフィールデータのリアルタイム更新を監視するカスタムフック
 * @param therapistId - セラピストのUUID
 * @param onUpdate - プロフィール更新時に呼び出されるコールバック関数
 */
export const useRealTimeProfileUpdates = (
  therapistId: string,
  onUpdate: (profile: TherapistProfile) => void
) => {
  const { error } = useSubscription<{ therapist_profiles: TherapistProfile[] }>(
    ON_THERAPIST_PROFILE_UPDATE,
    {
      variables: { therapistId },
      skip: !therapistId,
      onSubscriptionData: ({ subscriptionData }) => {
        const updatedProfile = subscriptionData.data?.therapist_profiles[0];
        if (updatedProfile) {
          onUpdate(updatedProfile);
        }
      },
    }
  );

  return {
    error: error ? new Error('リアルタイム更新のサブスクリプションに失敗しました') : null,
  };
};