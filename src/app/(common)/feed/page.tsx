// src/app/(common)/feed/page.tsx
"use client";
import dynamic from "next/dynamic";

const FeedClient = dynamic(() => import("./FeedClient"), { ssr: false });

export default function FeedPage() {
  return <FeedClient />;
}