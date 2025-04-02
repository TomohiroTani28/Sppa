"use client";
// src/app/(common)/feed/components/FeedPageWrapper.tsx
import dynamic from "next/dynamic";
import { useEffect } from "react";

// 動的インポート (SSR 無効)
const FeedPage = dynamic(() => import("@/app/(common)/feed/page"), {
  ssr: false,
});

export default function FeedPageWrapper() {
  // もし何かクライアントサイドの副作用あればここで使える
  useEffect(() => {
    console.log("Client-only FeedPageWrapper mounted");
  }, []);

  return <FeedPage />;
}
