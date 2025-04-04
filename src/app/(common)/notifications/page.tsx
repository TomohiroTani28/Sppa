// src/app/tourist/notifications/page.tsx
"use client";
import dynamic from "next/dynamic";

const NotificationsClient = dynamic(() => import("./NotificationsClient"), { ssr: false });

export default function NotificationsPage() {
  return <NotificationsClient />;
}