"use client";
// src/app/(common)/feed/page.tsx
import FeedClient from "./FeedClient";

// 「動的 import + RSC → Client」に起因するレースを解消
export const dynamic = "force-dynamic";

export default function FeedPage() {
  return <FeedClient />;
}
