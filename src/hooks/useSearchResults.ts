// src/hooks/useSearchResults.ts
import { useState, useEffect } from 'react';
import { useFetchTherapists } from '@/hooks/api/useFetchTherapists';
import { TherapistProfile, Therapist, WorkingHour, TherapistWorkingHours } from '@/types/therapist';

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
  const convertWorkingHours = (wh?: TherapistWorkingHours): WorkingHour[] => {
    if (!wh) return [];
    return Object.entries(wh).flatMap(([day, times]) =>
      times.map(({ start, end }) => ({
        day,
        startTime: start,
        endTime: end,
      }))
    );
  };

  const convertToTherapistProfile = (t: Therapist): TherapistProfile => ({
    ...t,
    user: { id: t.user_id, name: "Unknown" },
    location: typeof t.location === 'string' ? t.location : (t.location?.address ?? ""),
    workingHours: convertWorkingHours(t.working_hours),
  });

  useEffect(() => {
    setLoading(fetchLoading);
    setError(fetchError);
    setResults(therapists.map(convertToTherapistProfile));
  }, [therapists, fetchLoading, fetchError]);  

  return { results, loading, error };
}
