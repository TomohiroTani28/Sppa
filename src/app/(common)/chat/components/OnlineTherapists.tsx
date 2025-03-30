// src/app/(common)/chat/components/OnlineTherapists.tsx
"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-client";
import { useAuth } from "@/hooks/api/useAuth";

interface OnlineTherapistsProps {
  therapists: any[];
  onSelect: (chatRoomId: string) => void;
}

export default function OnlineTherapists({
  therapists,
  onSelect,
}: OnlineTherapistsProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, profile_picture")
        .in("id", therapists.map((t) => t.user_id));
      if (error) {
        console.error("ユーザー取得エラー:", error);
      } else {
        setUsers(data);
      }
    };
    fetchUsers();
  }, [therapists]);

  const createChatRoom = async (therapistId: string) => {
    // userが存在しない場合はチャットルーム作成を中断
    if (!user) {
      console.error("ユーザーが存在しません");
      return;
    }
    const { data, error } = await supabase
      .from("chat_rooms")
      .insert([{ participant1: user.id, participant2: therapistId }])
      .select()
      .single();
    if (error) {
      console.error("チャットルーム作成エラー:", error);
    } else {
      onSelect(data.id);
    }
  };

  return (
    <div className="online-therapists" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
      {users.map((therapist) => (
        <div
          key={therapist.id}
          className="therapist-item"
          onClick={() => createChatRoom(therapist.id)}
          style={{ display: "inline-block", marginRight: "10px" }}
        >
          <img
            src={therapist.profile_picture || "/default-avatar.png"}
            alt={therapist.name}
            className="avatar"
          />
          <span>{therapist.name}</span>
        </div>
      ))}
    </div>
  );
}
