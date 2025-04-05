// src/app/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FeedPageWrapper from "@/app/(common)/feed/components/FeedPageWrapper";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 認証状態に基づいてリダイレクト
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role === "therapist") {
      router.push("/therapist/dashboard");
    }
  }, [status, session, router]);

  // ローディング中の表示
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // 認証済みでtherapistでない場合にFeedPageWrapperを表示
  if (status === "authenticated" && session?.user?.role !== "therapist") {
    return <FeedPageWrapper />;
  }

  return null;
}