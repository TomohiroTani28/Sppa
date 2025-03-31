"use client";
// src/realtime/useRealtimeChat.ts
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase-client";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  recipientId: string;
  timestamp: number;
  isRead: boolean;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "file";
}

const useRealtimeChat = (chatRoomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatRoomId) {
      setError("Chat room ID is required");
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_room_id", chatRoomId)
        .order("created_at", { ascending: true });

      if (error) {
        setError("Failed to load messages");
        setLoading(false);
        return;
      }

      setMessages(data);
      setLoading(false);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat:${chatRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatRoomId]);

  return { messages, loading, error };
};

export default useRealtimeChat;
