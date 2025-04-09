"use client";
// src/app/(common)/chat/components/RecentConversations.tsx
import { useAuth } from "@/hooks/api/useAuth";
import supabase from "@/lib/supabase-client";
import { useEffect, useState } from "react";

interface RecentConversationsProps {
  readonly chatRooms: any[];
  readonly onSelect: (chatRoomId: string) => void;
}

export default function RecentConversations({
  chatRooms,
  onSelect,
}: RecentConversationsProps) {
  const { status, session, isLoadingToken } = useAuth();
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

  // 認証状態が読み込み中の場合
  if (status === "loading" || isLoadingToken) {
    return <div>Loading authentication...</div>;
  }

  // ユーザーがログインしていない場合
  if (!session?.user) {
    return <div>Please log in to view recent conversations.</div>;
  }

  return (
    <div className="recent-conversations">
      {chatRooms.map((room) => {
        const otherUserId =
          room.participant1 === session.user?.id ? room.participant2 : room.participant1;
        const otherUser = users.find((u) => u.id === otherUserId);
        return (
          <div
            key={room.id}
            className="conversation-item"
            role="button"
            tabIndex={0}
            onClick={() => onSelect(room.id)}
            onKeyPress={(e) => e.key === "Enter" && onSelect(room.id)}
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