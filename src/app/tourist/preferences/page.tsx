// src/app/(common)/preferences/page.tsx
"use client";
import dynamic from "next/dynamic";

// 別の名前を使用
export const fetchCache = "force-no-store";
export const revalidate = 0;

// 動的インポート
const PreferencesClient = dynamic(() => import("@/app/tourist/preferences/PreferencesClient"), { ssr: false });

export default function PreferencesPage() {
  return <PreferencesClient />;
}