// src/app/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FeedPageWrapper from "@/app/(common)/feed/components/FeedPageWrapper";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 認証状態が確定した時点での処理
    if (status === "unauthenticated") {
      console.log("未ログインユーザー: ログインページへリダイレクト");
      router.push("/login");
    } else if (status === "authenticated") {
      if (session?.user?.role === "therapist") {
        console.log("セラピストユーザー: ダッシュボードへリダイレクト");
        router.push("/therapist/dashboard");
      } else {
        console.log("一般ユーザー: フィードページを表示");
        // フィードを表示（リダイレクトなし）
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated" && session?.user?.role !== "therapist") {
    return <FeedPageWrapper />;
  }

  // ローディング中か、リダイレクト処理中の場合は空のコンテンツを表示
  return <div></div>;
}