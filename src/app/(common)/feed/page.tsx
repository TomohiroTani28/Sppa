"use client";
// src/app/(common)/feed/page.tsx
import { FeedClient } from './FeedClient';

export const dynamic = "force-dynamic";

export default function FeedPage() {
  return <FeedClient />;
}
