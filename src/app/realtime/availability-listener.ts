// src/app/realtime/availability-listener.ts
import supabase from "@/app/lib/supabase-client";

export const subscribeToAvailability = (
  therapistId: string,
  callback: (availability: any[]) => void,
) => {
  const channel = supabase
    .channel(`availability_${therapistId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "therapist_availability",
        filter: `therapist_id=eq.${therapistId}`,
      },
      (payload) => {
        callback([payload.new]);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
