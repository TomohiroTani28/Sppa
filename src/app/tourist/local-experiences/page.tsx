// src/app/tourist/local-experiences/page.tsx
"use client";
import dynamic from "next/dynamic";

// 完全に異なる名前を使用
export const fetchCache = "force-no-store";
export const revalidate = 0;

// 動的インポート
const LocalExperiencesClient = dynamic(() => import("@/app/tourist/local-experiences/LocalExperiencesClient"), { ssr: false });

export default function LocalExperiencesPage() {
  return <LocalExperiencesClient />;
}