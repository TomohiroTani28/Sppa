// src/app/tourist/chat/components/ChatWindow.tsx
"use client";

import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabase-client";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

interface ChatWindowProps {
  chatRoomId: string;
  senderId: string;
}

export default function ChatWindow({ chatRoomId, senderId }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_room_id", chatRoomId)
        .order("created_at", { ascending: true });
      if (error) {
        console.error("メッセージ取得エラー:", error);
      } else {
        setMessages(data);
      }
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
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatRoomId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const { error } = await supabase.from("chat_messages").insert([
      {
        chat_room_id: chatRoomId,
        sender_id: senderId,
        message_text: newMessage,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.error("メッセージ送信エラー:", error);
    } else {
      setNewMessage("");
    }
  };

  return (
    <div className="chat-window">
      <div className="messages" style={{ height: "400px", overflowY: "auto" }}>
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <p>{msg.message_text}</p>
            <small>{new Date(msg.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className="input-area" style={{ display: "flex", marginTop: "10px" }}>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="メッセージを入力..."
          style={{ flex: 1, marginRight: "10px" }}
        />
        <Button onClick={sendMessage}>送信</Button>
      </div>
    </div>
  );
}