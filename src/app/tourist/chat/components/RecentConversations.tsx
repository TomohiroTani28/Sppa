// src/app/tourist/chat/components/RecentConversations.tsx
"use client";

import { useEffect, useState } from "react";
import supabase from "@/app/lib/supabase-client";
import { useAuth } from "@/app/hooks/api/useAuth";

interface RecentConversationsProps {
  chatRooms: any[];
  onSelect: (chatRoomId: string) => void;
}

export default function RecentConversations({
  chatRooms,
  onSelect,
}: RecentConversationsProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, profile_picture");
      if (error) {
        console.error("ユーザー取得エラー:", error);
      } else {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  // userがnullの場合はレンダリングしない、もしくはローディング表示を返す
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recent-conversations">
      {chatRooms.map((room) => {
        const otherUserId =
          room.participant1 === user.id ? room.participant2 : room.participant1;
        const otherUser = users.find((u) => u.id === otherUserId);
        return (
          <div
            key={room.id}
            className="conversation-item"
            onClick={() => onSelect(room.id)}
          >
            <img
              src={otherUser?.profile_picture || "/default-avatar.png"}
              alt={otherUser?.name || "不明"}
              className="avatar"
            />
            <span>{otherUser?.name || "不明"}</span>
          </div>
        );
      })}
    </div>
  );
}
