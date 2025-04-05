"use client";
// src/app/(common)/feed/components/FeedPageWrapper.tsx
import dynamic from "next/dynamic";
import { useEffect } from "react";

const FeedPage = dynamic(() => import("@/app/(common)/feed/page"), {
  ssr: false,
});

export default function FeedPageWrapper() {
  useEffect(() => {
    console.log("Client-only FeedPageWrapper mounted");
  }, []);

  return <FeedPage />;
}