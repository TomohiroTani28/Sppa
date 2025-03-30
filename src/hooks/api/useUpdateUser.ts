// src/app/hooks/api/useUpdateUser.ts
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_PROFILE } from "@/app/lib/queries/user";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateUserMutation] = useMutation(UPDATE_USER_PROFILE);

  const updateUser = async (userId: string, data: any) => {
    setLoading(true);
    try {
      await updateUserMutation({
        variables: {
          user_id: userId,
          name: data.name,
          email: data.email,
          bio: data.bio,
          nationality: data.nationality,
          languages: data.languages,
        },
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
};