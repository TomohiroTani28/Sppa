// src/app/(common)/chat/[userId]/page.tsx
"use client";

export const dynamic = "force-dynamic";

import AutoTranslateToggle from "@/app/(common)/chat/components/AutoTranslateToggle";
import ChatWindow from "@/app/(common)/chat/components/ChatWindow";
import BottomNavigation from "@/components/BottomNavigation";
import ChatHeader from "@/components/ChatHeader";
import { useAuth as useAuthHook } from "@/hooks/api/useAuth";
import { useTranslation } from "next-i18next";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { t } = useTranslation("common");
  const { userId } = useParams();
  const authState = useAuthHook(); // 直接 authState を取得
  const [isLoading, setIsLoading] = useState(true);

  // ローディング状態を監視
  useEffect(() => {
    if (authState.loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [authState.loading]);

  useEffect(() => {
    console.log(`ChatPage mounted for userId: ${userId}`);
  }, [userId]);

  // ローディング中
  if (isLoading) {
    return <p className="text-gray-500 text-center">{t("loading")}</p>;
  }

  // userId または user が存在しない場合
  if (!userId) return <p className="text-gray-500 text-center">{t("chat.noChatRoom")}</p>;
  if (!authState.user) return <p className="text-gray-500 text-center">{t("auth.required")}</p>;

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