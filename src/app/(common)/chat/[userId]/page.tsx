// src/app/(common)/chat/[userId]/page.tsx
"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "next-i18next";
import ChatHeader from "@/components/ChatHeader";
import BottomNavigation from "@/components/BottomNavigation";
import ChatWindow from "@/app/(common)/chat/components/ChatWindow";
import AutoTranslateToggle from "@/app/(common)/chat/components/AutoTranslateToggle";
import { useAuth as useAuthHook } from "@/hooks/api/useAuth";

// 認証状態の型を定義
interface AuthState {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role?: string } | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

export default function ChatPage() {
  const { t } = useTranslation("common");
  const { userId } = useParams();
  const { getAuthState } = useAuthHook(); // getAuthState を使用
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 認証状態を非同期で取得
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const state = await getAuthState();
        setAuthState(state);
      } catch (error) {
        console.error("Failed to fetch auth state:", error);
        setAuthState(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuthState();
  }, [getAuthState]);

  useEffect(() => {
    console.log(`ChatPage mounted for userId: ${userId}`);
  }, [userId]);

  // ローディング中
  if (isLoading) {
    return <p className="text-gray-500 text-center">{t("loading")}</p>;
  }

  // userId または user が存在しない場合
  if (!userId) return <p className="text-gray-500 text-center">{t("chat.noChatRoom")}</p>;
  if (!authState?.user) return <p className="text-gray-500 text-center">{t("auth.required")}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-300">
      <ChatHeader />
      <main className="flex-1 p-4 overflow-y-auto">
        {/* ChatWindow にチャット相手の ID を渡す */}
        <ChatWindow receiverId={userId as string} />
      </main>
      <div className="p-4 border-t border-gray-200 bg-black">
        <div className="flex items-center justify-between mb-2">
          <AutoTranslateToggle />
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}