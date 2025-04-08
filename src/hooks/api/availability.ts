// src/hooks/api/availability.ts
import { updateAvailability as updateAvailabilityApi } from "@/backend/api/graphql/availability";
import type { TherapistAvailability } from "@/types/availability";
import { useState } from "react";

export const useUpdateAvailability = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateAvailability = async (
    therapistId: string,
    availability: TherapistAvailability
  ) => {
    setIsPending(true);
    setError(null);
    try {
      const result = await updateAvailabilityApi(therapistId, availability);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("更新に失敗しました"));
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { updateAvailability, isPending, error };
};