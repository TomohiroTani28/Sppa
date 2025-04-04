// src/app/therapist/profile/page.tsx
"use client";
import dynamic from "next/dynamic";

const ProfileClient = dynamic(() => import("./ProfileClient"), { ssr: false });

export default function ProfilePage() {
  return <ProfileClient />;
}