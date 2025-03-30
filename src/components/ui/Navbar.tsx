"use client";
// src/app/components/ui/Navbar.tsx
import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabase-client";
import Link from "next/link";
import type { SppaUser } from "@/app/lib/auth"; // 修正: AuthUser → SppaUser
import { getClientSideUser } from "@/app/lib/auth";

export default function Navbar() {
  const [user, setUser] = useState<SppaUser>(null); // 修正: AuthUser → SppaUser
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const currentUser = await getClientSideUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAuthStatus();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
