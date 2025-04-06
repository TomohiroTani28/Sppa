// src/app/(common)/notifications/page.tsx
"use client";
import dynamicImport from "next/dynamic"; // エイリアスを使用して名前衝突を回避

export const dynamic = "force-dynamic"; // 静的生成を無効化し、動的レンダリングに

const NotificationsClient = dynamicImport(() => import("./NotificationsClient"), { ssr: false });

export default function NotificationsPage() {
  return <NotificationsClient />;
}