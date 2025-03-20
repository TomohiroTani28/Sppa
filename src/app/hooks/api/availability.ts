// src/app/hooks/api/availability.ts
import { useState } from "react";
import { updateAvailability as updateAvailabilityApi } from "@/backend/api/graphql/availability";
import { TherapistAvailability } from "@/types/availability";

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