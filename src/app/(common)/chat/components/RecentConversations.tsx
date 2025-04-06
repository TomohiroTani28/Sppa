"use client";
// src/app/(common)/chat/components/RecentConversations.tsx
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-client";
import { useAuth } from "@/hooks/api/useAuth";

interface AuthState {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role?: string } | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

interface RecentConversationsProps {
  readonly chatRooms: any[];
  readonly onSelect: (chatRoomId: string) => void;
}

export default function RecentConversations({
  chatRooms,
  onSelect,
}: RecentConversationsProps) {
  const { getAuthState } = useAuth();
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const state = await getAuthState();
        setAuthState(state);
      } catch (error) {
        console.error("Failed to fetch auth state:", error);
        setAuthState(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    fetchAuthState();
  }, [getAuthState]);

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

  if (isLoadingAuth) {
    return <div>Loading authentication...</div>;
  }

  if (!authState?.user) {
    return <div>Please log in to view recent conversations.</div>;
  }

  return (
    <div className="recent-conversations">
      {chatRooms.map((room) => {
        const otherUserId =
          room.participant1 === authState.user?.id ? room.participant2 : room.participant1;
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