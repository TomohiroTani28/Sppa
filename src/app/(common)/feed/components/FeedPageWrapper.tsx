"use client";
// src/app/(common)/feed/components/FeedPageWrapper.tsx
import { useEffect } from "react";
import dynamic from "next/dynamic";

// FeedClient は純粋なクライアントコンポーネント
const FeedClient = dynamic(
  () => import("@/app/(common)/feed/FeedClient"),
  { ssr: false }
);

export default function FeedPageWrapper() {
  useEffect(() => {
    console.log("Client-only FeedPageWrapper mounted");
  }, []);

  return <FeedClient />;
}
