// src/app/(common)/notifications/page.tsx
"use client";
import dynamic from "next/dynamic";

export const dynamic = "force-dynamic"; // 静的生成を無効化し、動的レンダリングに

const NotificationsClient = dynamic(() => import("./NotificationsClient"), { ssr: false });

export default function NotificationsPage() {
  return <NotificationsClient />;
}