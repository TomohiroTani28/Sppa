// src/realtime/useRealtimeEvents.ts
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase-client";

export const useRealtimeEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 初期データの取得
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from("events").select("*");
        if (error) throw error;
        setEvents(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // リアルタイムリスナーの設定
    const channel = supabase
      .channel("events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              setEvents((prev) => [...prev, payload.new]);
              break;
            case "UPDATE":
              setEvents((prev) =>
                prev.map((event) =>
                  event.id === payload.new.id ? payload.new : event,
                ),
              );
              break;
            case "DELETE":
              setEvents((prev) =>
                prev.filter((event) => event.id !== payload.old.id),
              );
              break;
          }
        },
      )
      .subscribe();

    // クリーンアップ
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { events, loading, error };
};
