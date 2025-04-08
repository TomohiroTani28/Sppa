"use client";
// src/hooks/useTherapistDetails.ts
import type { Therapist } from "@/types/therapist";
import { useEffect, useState } from "react";

// セラピストの詳細を取得するフック
export function useTherapistDetails(therapistId: string) {
  const [data, setData] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTherapistDetails() {
      try {
        // 実際のプロジェクトでは、Supabase や Hasura を使用している可能性があるため、
        // エンドポイントを `/api/therapists/${therapistId}` に設定
        const response = await fetch(`/api/therapists/${therapistId}`);
        if (!response.ok) {
          throw new Error("セラピスト詳細の取得に失敗しました");
        }
        const therapist: Therapist = await response.json();
        setData(therapist);
      } catch (err: any) {
        setError(err.message || "不明なエラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    if (therapistId) {
      fetchTherapistDetails();
    } else {
      setError("セラピストIDが提供されていません");
      setLoading(false);
    }
  }, [therapistId]);

  return { data, loading, error };
}

// セラピストの詳細を更新するフック
export function useUpdateTherapistDetails() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function updateTherapistDetails(updatedDetails: Partial<Therapist>) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/therapists/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDetails),
      });
      if (!response.ok) {
        throw new Error("セラピスト詳細の更新に失敗しました");
      }
      // 更新成功時は何も返さない（必要に応じてレスポンスを返すことも可能）
    } catch (err: any) {
      setError(err.message || "更新中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }

  return { updateTherapistDetails, isLoading, error };
}