// src/app/tourist/chat/page.tsx
"use client";

import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabase-client";
import { useAuth } from "@/app/hooks/api/useAuth";
import ChatWindow from "./components/ChatWindow";
import SearchBar from "@/app/tourist/chat/components/SearchBar";
import OnlineTherapists from "@/app/tourist/chat/components/OnlineTherapists";
import RecentConversations from "@/app/tourist/chat/components/RecentConversations";
import BottomNavigation from "@/app/components/common/BottomNavigation";

export default function ChatPage() {
  const { user, profile_picture } = useAuth();
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [onlineTherapists, setOnlineTherapists] = useState<any[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ユーザー情報がない場合はローディング表示を返す
  if (!user) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    fetchChatRooms();
    fetchOnlineTherapists();
  }, [user]);

  const fetchChatRooms = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .or(`participant1.eq.${user.id},participant2.eq.${user.id}`);

      if (error) {
        throw new Error(
          `チャットルーム取得エラー: ${error.message} (コード: ${error.code})`
        );
      }

      setChatRooms(data || []);
      setErrorMessage(null);
    } catch (err: any) {
      console.error(err.message);
      setErrorMessage("チャットルームの取得に失敗しました。後でもう一度お試しください。");
    }
  };

  const fetchOnlineTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from("therapist_profiles")
        .select("user_id, status")
        .eq("status", "online");

      if (error) {
        throw new Error(
          `オンラインセラピスト取得エラー: ${error.message} (コード: ${error.code})`
        );
      }

      setOnlineTherapists(data || []);
      setErrorMessage(null);
    } catch (err: any) {
      console.error(err.message);
      setErrorMessage("オンラインセラピストの取得に失敗しました。後でもう一度お試しください。");
    }
  };

  const filteredChatRooms = chatRooms.filter((room) =>
    room.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-page" style={{ paddingBottom: "60px" }}>
      {errorMessage && (
        <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
          {errorMessage}
        </div>
      )}

      <SearchBar onSearch={setSearchQuery} />

      {searchQuery ? (
        <RecentConversations
          chatRooms={filteredChatRooms.length > 0 ? filteredChatRooms : []}
          onSelect={setSelectedChatRoom}
        />
      ) : (
        <OnlineTherapists
          therapists={onlineTherapists.length > 0 ? onlineTherapists : []}
          onSelect={setSelectedChatRoom}
        />
      )}

      {selectedChatRoom && (
        <ChatWindow chatRoomId={selectedChatRoom} senderId={user.id} />
      )}

      <BottomNavigation
        // profile_picture の値が null の場合は undefined を渡す
        profilePictureUrl={profile_picture || undefined}
        userType={user.role as "tourist" | "therapist"}
      />
    </div>
  );
}
