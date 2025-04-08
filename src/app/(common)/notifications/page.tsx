// src/app/(common)/notifications/page.tsx
"use client";
import { default as nextDynamic } from "next/dynamic";

// Force dynamic rendering to avoid SSG issues with client-side hooks
export const dynamic = 'force-dynamic';

const NotificationsClient = nextDynamic(() => import("./NotificationsClient"), { ssr: false });

export default function NotificationsPage() {
  return <NotificationsClient />;
}