// src/app/(common)/notifications/page.tsx
"use client";
import dynamic from "next/dynamic";

// Force dynamic rendering to avoid SSG issues with client-side hooks
export const forceDynamic = "force-dynamic";

const NotificationsClient = dynamic(() => import("./NotificationsClient"), { ssr: false });

export default function NotificationsPage() {
  return <NotificationsClient />;
}