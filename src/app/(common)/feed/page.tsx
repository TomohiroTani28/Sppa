// src/app/(common)/feed/page.tsx
import dynamic from "next/dynamic";

const FeedClient = dynamic(() => import("./FeedClient"), { ssr: false });

export default function FeedPage() {
  return <FeedClient />;
}