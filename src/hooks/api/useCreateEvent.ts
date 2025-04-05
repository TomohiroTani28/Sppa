// src/hooks/api/useCreateEvent.ts
import { useState } from "react";
import supabase from "@/lib/supabase-client";
import useAuth from "@/hooks/api/useAuth";

interface EventData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export const useCreateEvent = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEvent = async (eventData: EventData) => {
    if (!user) {
      setError(new Error("ユーザーが認証されていません"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.from("events").insert([
        {
          therapist_id: user.id,
          title: eventData.title,
          description: eventData.description,
          start_date: eventData.startDate,
          end_date: eventData.endDate,
          location: eventData.location,
        },
      ]);

      if (error) throw error;
      // リアルタイムでイベントリストを更新する処理をここに追加可能
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, loading, error };
};
