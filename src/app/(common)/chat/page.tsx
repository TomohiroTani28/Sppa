"use client";
// src/app/(common)/chat/page.tsx
import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";

const ChatClient = dynamicImport(() => import("./ChatClient"), { ssr: false });

export default function ChatPage() {
  return <ChatClient />;
}