"use client";
// src/app/(common)/feed/page.tsx
import dynamicImport from "next/dynamic"; // エイリアスを使用して名前衝突を回避

// Next.js の動的レンダリング設定
export const dynamic = "force-dynamic";

// 動的インポート用の dynamic 関数を使用
const FeedClient = dynamicImport(() => import("./FeedClient"), { ssr: false });

export default function FeedPage() {
  return <FeedClient />;
}