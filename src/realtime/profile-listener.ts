// src/realtime/profile-listener.ts
import supabase from "@/lib/supabase-client";

export const subscribeToProfile = (
  userId: string,
  callback: (profile: any) => void,
) => {
  const channel = supabase
    .channel(`profile_${userId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
        filter: `id=eq.${userId}`,
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
