"use client";
// src/hooks/useUserProfile.ts
import { useState, useEffect } from "react";
import { User } from "@/types/user";

// therapistId を引数にとり、指定したユーザのプロフィールを取得するフック
export function useUserProfile(therapistId: string) {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        // 実際のエンドポイントに合わせて URL を変更してください
        const response = await fetch(`/api/user-profile/${therapistId}`);
        if (!response.ok) {
          throw new Error("ユーザープロフィールの取得に失敗しました");
        }
        const user: User = await response.json();
        setData(user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, [therapistId]);

  return { data, loading, error };
}

// ユーザープロフィールを更新するフック
export function useUpdateUserProfile() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function updateUserProfile(updatedProfile: User) {
    setIsLoading(true);
    setError(null);
    try {
      // 実際のエンドポイントに合わせて URL や HTTP メソッドを変更してください
      const response = await fetch("/api/update-user-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });
      if (!response.ok) {
        throw new Error("ユーザープロフィールの更新に失敗しました");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { updateUserProfile, isLoading, error };
}