// src/app/(common)/search/hooks/useSearchResults.ts
import { useState, useEffect } from 'react';
import { useFetchTherapists } from '@/app/hooks/api/useFetchTherapists';
import { TherapistProfile, Therapist, TherapistLocation } from '@/types/therapist';

export function useSearchResults(query: string, filters: Record<string, string>) {
  const [results, setResults] = useState<TherapistProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // APIからセラピスト情報を取得
  const { therapists, loading: fetchLoading, error: fetchError } = useFetchTherapists({
    searchTerm: query, 
    ...filters,
  });

  // Therapist → TherapistProfile に変換する関数
  const convertToTherapistProfile = (t: Therapist): TherapistProfile => ({
    ...t,
    user: { id: t.user_id, name: "Unknown" },  // user_id を元にデフォルトの user オブジェクトを作成
    location: typeof t.location === 'string' ? t.location : t.location?.address || "", 
  });

  useEffect(() => {
    setLoading(fetchLoading);
    setError(fetchError);
    setResults(therapists.map(convertToTherapistProfile));
  }, [therapists, fetchLoading, fetchError]);  

  return { results, loading, error };
}
