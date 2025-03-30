'use client';
// src/app/components/common/HomeHeader.tsx
import Link from "next/link";
import WelcomeMessage from "@/app/tourist/home/components/WelcomeMessage";
import React from "react";

interface HomeHeaderProps {
  readonly user: { name: string; profilePicture: string; email: string };
  readonly unreadCount: number;
  readonly t: (key: string) => string;
}

// 非同期コンポーネントではないことを明示する
export default function HomeHeader({ user, unreadCount, t }: HomeHeaderProps) {
  return (
    <header className="bg-white p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <WelcomeMessage user={user} />
        <div className="flex items-center space-x-3">
          <Link href="/tourist/preferences" className="text-blue-500">
            <span>設定</span>
          </Link>
          <Link href="/tourist/notifications" className="relative">
            <span>
              <svg /* アイコンコード省略 */></svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
