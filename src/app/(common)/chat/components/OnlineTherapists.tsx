"use client";
// src/app/(common)/chat/components/OnlineTherapists.tsx
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-client";
import { useAuth } from "@/hooks/api/useAuth";

interface OnlineTherapistsProps {
  readonly therapists: any[];
  readonly onSelect: (chatRoomId: string) => void;
}

export default function OnlineTherapists({
  therapists,
  onSelect,
}: OnlineTherapistsProps) {
  const authState = useAuth();
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
    if (!authState.user) {
      console.error("ユーザーが存在しません");
      return;
    }
    const { data, error } = await supabase
      .from("chat_rooms")
      .insert([{ participant1: authState.user.id, participant2: therapistId }])
      .select()
      .single();
    if (error) {
      console.error("チャットルーム作成エラー:", error);
    } else {
      onSelect(data.id);
    }
  };

  if (authState.loading) {
    return <div>Loading authentication...</div>;
  }

  if (!authState.user) {
    return <div>Please log in to view therapists.</div>;
  }

  return (
    <div className="online-therapists" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
      {users.map((therapist) => (
        <div
          key={therapist.id}
          className="therapist-item"
          role="button"
          tabIndex={0}
          onClick={() => createChatRoom(therapist.id)}
          onKeyPress={(e) => e.key === "Enter" && createChatRoom(therapist.id)}
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