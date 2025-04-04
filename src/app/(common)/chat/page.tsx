// src/app/(common)/chat/page.tsx
"use client";
import dynamic from "next/dynamic";

const ChatClient = dynamic(() => import("./ChatClient"), { ssr: false });

export default function ChatPage() {
  return <ChatClient />;
}