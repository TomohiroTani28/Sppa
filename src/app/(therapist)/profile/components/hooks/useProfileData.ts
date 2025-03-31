// src/app/(therapist)/profile/components/hooks/useProfileData.ts
import { useQuery } from '@apollo/client';
import { GET_THERAPIST_PROFILE } from '@/graphql/queries';
import { TherapistProfile } from '@/types/therapist';

/**
 * セラピストのプロフィールデータを取得するカスタムフック
 * @param therapistId - セラピストのUUID
 * @returns プロフィールデータ、ローディング状態、エラー
 */
export const useProfileData = (therapistId: string) => {
  const { data, loading, error } = useQuery<{ therapist_profiles_by_pk: TherapistProfile }>(
    GET_THERAPIST_PROFILE,
    {
      variables: { id: therapistId },
      skip: !therapistId, // therapistIdがない場合はクエリをスキップ
      fetchPolicy: 'cache-and-network', // キャッシュとネットワークの両方を使用
    }
  );

  return {
    profile: data?.therapist_profiles_by_pk ?? null,
    loading,
    error: error ? new Error('プロフィールデータの取得に失敗しました') : null,
  };
};