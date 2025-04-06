// src/hooks/api/useCreateEvent.ts
import { useState } from "react";
import supabase from "@/lib/supabase-client";
import { useAuth } from "@/hooks/api/useAuth";

interface EventData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export const useCreateEvent = () => {
  const auth = useAuth(); // Changed from destructuring { user }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEvent = async (eventData: EventData) => {
    setLoading(true);
    setError(null);

    try {
      // Get the auth state asynchronously
      const authState = await auth.getAuthState();
      const user = authState.user;

      // Check if user exists
      if (!user) {
        throw new Error("ユーザーが認証されていません");
      }

      // Insert event into Supabase, only destructuring error since data isn't used
      const { error } = await supabase.from("events").insert([
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
      // Add real-time event list update here if needed
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, loading, error };
};