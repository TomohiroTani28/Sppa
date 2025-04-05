"use client";
// src/components/ui/Navbar.tsx
import { useAuthClient } from "@/lib/auth.client";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar() {
  // useAuthClient フックを使用してユーザー情報とローディング状態を取得
  const { user, loading } = useAuthClient();

  // ログアウト処理
  const handleSignOut = async () => {
    try {
      await signOut();
      // 必要に応じてリダイレクトや状態更新を追加
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // 表示内容を条件分岐で決定
  let content;
  if (loading) {
    content = <span>読み込み中...</span>;
  } else if (user) {
    content = (
      <>
        <Link href="/dashboard" className="hover:underline">ダッシュボード</Link>
        <button onClick={handleSignOut} className="hover:underline">ログアウト</button>
      </>
    );
  } else {
    content = (
      <>
        <Link href="/login" className="hover:underline">ログイン</Link>
        <Link href="/signup" className="hover:underline">サインアップ</Link>
      </>
    );
  }

  // ナビゲーションバーのレンダリング
  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Sppa
        </Link>
        <div className="space-x-4">{content}</div>
      </div>
    </nav>
  );
}