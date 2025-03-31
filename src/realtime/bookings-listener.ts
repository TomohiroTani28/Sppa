// src/realtime/bookings-listener.ts
import supabase from "@/lib/supabase-client";

export const subscribeToBookings = (
  userId: string,
  callback: (bookings: any[]) => void,
) => {
  const channel = supabase
    .channel(`bookings_${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookings",
        filter: `guest_id=eq.${userId}`,
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
