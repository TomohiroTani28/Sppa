"use client";
// src/app/tourist/profile/page.tsx
import dynamic from "next/dynamic";

// dynamic 変数名の代わりに別の変数名を使用
export const fetchCache = "force-no-store";
export const revalidate = 0;

const ProfileClient = dynamic(() => import("@/app/tourist/profile/ProfileClient"), { ssr: false });

export default function ProfilePage() {
  return <ProfileClient />;
}