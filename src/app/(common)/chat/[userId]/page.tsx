// src/app/(common)/chat/[userId]/page.tsx
"use client";

export const dynamic = "force-dynamic";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "next-i18next";
import ChatHeader from "@/components/ChatHeader";
import BottomNavigation from "@/components/BottomNavigation";
import ChatWindow from "@/app/(common)/chat/components/ChatWindow";
import AutoTranslateToggle from "@/app/(common)/chat/components/AutoTranslateToggle";
import { useAuth } from "@/hooks/api/useAuth";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function ChatPage() {
  const { t } = useTranslation("common");
  const { userId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    console.log(`ChatPage mounted for userId: ${userId}`);
  }, [userId]);

  if (!userId) return <p className="text-gray-500 text-center">{t("chat.noChatRoom")}</p>;
  if (!user) return <p className="text-gray-500 text-center">{t("auth.required")}</p>;

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
