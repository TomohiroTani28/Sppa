// src/app/(common)/chat/page.tsx
"use client";

import SearchBar from "@/app/(common)/search/components/SearchBar";
import Avatar from "@/app/components/common/Avatar";
import BottomNavigation from "@/app/components/common/BottomNavigation";
import ChatHeader from "@/app/components/common/ChatHeader";
import { ChatProvider } from "@/app/contexts/ChatContext";
import useIsomorphicLayoutEffect from "@/app/hooks/api/useIsomorphicLayoutEffect";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { useRecentChats } from "@/hooks/useRecentChats";
import { useSearchUsers } from "@/hooks/useSearchUsers";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// 型定義
interface User {
  id: number | string;
  name: string;
  profile_picture?: string;
  bio?: string;
}

interface Chat {
  id: number | string;
  receiver_id: number | string;
  profile_picture?: string;
  name: string;
  content: string;
  sent_at: string;
}

interface OnlineAccountListProps {
  onlineUsers: User[];
  handleAccountClick: (userId: number | string) => void;
}

// サブコンポーネント: オンラインユーザー一覧
const OnlineAccountList: React.FC<OnlineAccountListProps> = ({ onlineUsers, handleAccountClick }) => (
  <section className="mb-6">
    <h2 className="text-lg font-semibold mb-2">オンライン</h2>
    <div className="flex overflow-x-auto space-x-4 pb-2">
      {onlineUsers.map((user: User) => (
        <button
          key={user.id}
          onClick={() => handleAccountClick(user.id)}
          className="flex flex-col items-center min-w-[80px] outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="relative">
            <Avatar
              imageUrl={user.profile_picture || "/images/default-avatar.jpg"}
              alt={user.name}
              size="sm"
              className="w-14 h-14"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
          </div>
          <p className="text-sm mt-1 truncate w-full text-center">{user.name}</p>
        </button>
      ))}
    </div>
  </section>
);

interface RecentChatListProps {
  recentChats: Chat[];
  handleAccountClick: (userId: number | string) => void;
}

// サブコンポーネント: 最近のチャット一覧
const RecentChatList: React.FC<RecentChatListProps> = ({ recentChats, handleAccountClick }) => (
  <section>
    <h2 className="text-lg font-semibold mb-2">最近のチャット</h2>
    <ul className="space-y-4">
      {recentChats.map((chat: Chat) => (
        <li key={chat.id} className="flex items-center p-2 rounded-lg hover:bg-gray-800">
          <button
            onClick={() => handleAccountClick(chat.receiver_id)}
            className="flex items-center w-full outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Avatar
              imageUrl={chat.profile_picture || "/images/default-avatar.jpg"}
              alt={chat.name}
              size="sm"
              className="w-12 h-12 mr-3"
            />
            <div className="flex-1">
              <p className="font-medium">{chat.name}</p>
              <p className="text-sm text-gray-500 truncate">{chat.content}</p>
            </div>
            <span className="text-xs text-gray-600">
              {new Date(chat.sent_at).toLocaleTimeString()}
            </span>
          </button>
        </li>
      ))}
    </ul>
  </section>
);

interface SearchResultsProps {
  searchResults: User[];
  handleAccountClick: (userId: number | string) => void;
}

// サブコンポーネント: 検索結果
const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, handleAccountClick }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">検索結果</h2>
    {searchResults.length > 0 ? (
      <ul className="space-y-2">
        {searchResults.map((user: User) => (
          <li key={user.id} className="flex items-center p-2 rounded-lg hover:bg-gray-800">
            <button
              onClick={() => handleAccountClick(user.id)}
              className="flex items-center w-full outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Avatar
                imageUrl={user.profile_picture || "/images/default-avatar.jpg"}
                alt={user.name}
                size="sm"
                className="w-12 h-12 mr-3"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">
                  {user.bio || "No bio available"}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">一致するユーザーが見つかりません</p>
    )}
  </div>
);

// メインコンポーネント: ChatContent
const ChatContent: React.FC = () => {
  const router = useRouter();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onlineUsers = useOnlineUsers() as User[];
  const recentChats = useRecentChats() as Chat[];
  const searchResults = useSearchUsers(searchQuery) as User[];

  useIsomorphicLayoutEffect(() => {
    console.log("ChatPage mounted");
  }, []);

  const handleSearchTap = () => setSearchActive(true);
  const handleSearchChange = (query: string) => setSearchQuery(query);
  const handleAccountClick = (userId: number | string) => router.push(`/tourist/chat/${userId}`);

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-300">
      <ChatHeader />
      <main className="flex-1 p-4 overflow-y-auto">
        <SearchBar
          placeholder="検索"
          onTap={handleSearchTap}
          onChange={handleSearchChange}
          isActive={searchActive}
          className="mb-4"
        />
        {searchActive && searchQuery ? (
          <SearchResults searchResults={searchResults} handleAccountClick={handleAccountClick} />
        ) : (
          <>
            <OnlineAccountList onlineUsers={onlineUsers} handleAccountClick={handleAccountClick} />
            <RecentChatList recentChats={recentChats} handleAccountClick={handleAccountClick} />
          </>
        )}
      </main>
      <BottomNavigation />
    </div>
  );
};

// ChatPage コンポーネント
export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
}
