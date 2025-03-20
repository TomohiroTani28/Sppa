// src/app/realtime/likes-listener.ts
import supabase from "@/app/lib/supabase-client";

export const subscribeToLikes = (
  userId: string,
  callback: (like: any) => void,
) => {
  const channel = supabase
    .channel(`likes_${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "likes",
        filter: `guest_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
