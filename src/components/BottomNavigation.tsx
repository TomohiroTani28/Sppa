"use client";
// src/components/BottomNavigation.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Search, Calendar, MessageSquare } from "lucide-react";
import Image from "next/image";
import getSessionRole from "@/lib/auth.client";

interface BottomNavigationProps {
  profilePictureUrl?: string;
  userType?: "tourist" | "therapist" | "common";
}

/**
 * ボトムナビゲーションコンポーネント
 * @param props - プロフィール画像URLとユーザータイプ
 */
const BottomNavigation: React.FC<BottomNavigationProps> = ({
  profilePictureUrl,
  userType,
}) => {
  const [userRole, setUserRole] = useState<"tourist" | "therapist" | "common" | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await getSessionRole();
      setUserRole(role ?? userType ?? "tourist"); // Use ?? instead of ||
    };
    fetchRole();
  }, [userType]);

  // プロフィールアイコンを生成する関数
  const getProfileIcon = (url?: string) =>
    url ? (
      <Image
        src={url}
        alt="Profile"
        width={32}
        height={32}
        className="rounded-full"
      />
    ) : (
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold">
        P
      </div>
    );

  const commonNav = [
    { href: "/feed", icon: <Home className="w-6 h-6" />, key: "home" },
    { href: "/search", icon: <Search className="w-6 h-6" />, key: "search" },
    { href: "/activity", icon: <Calendar className="w-6 h-6" />, key: "activity" },
    { href: "/chat", icon: <MessageSquare className="w-6 h-6" />, key: "chat" },
    { href: "/profile", icon: getProfileIcon(profilePictureUrl), key: "profile" },
  ];

  const touristNav = [
    { href: "/feed", icon: <Home className="w-6 h-6" />, key: "home" },
    { href: "/search", icon: <Search className="w-6 h-6" />, key: "search" },
    { href: "/tourist/bookings", icon: <Calendar className="w-6 h-6" />, key: "bookings" },
    { href: "/chat", icon: <MessageSquare className="w-6 h-6" />, key: "chat" },
    { href: "/tourist/profile", icon: getProfileIcon(profilePictureUrl), key: "profile" },
  ];

  const therapistNav = [
    { href: "/therapist/dashboard", icon: <Home className="w-6 h-6" />, key: "dashboard" },
    { href: "/therapist/schedule", icon: <Calendar className="w-6 h-6" />, key: "schedule" },
    { href: "/chat", icon: <MessageSquare className="w-6 h-6" />, key: "chat" },
    { href: "/therapist/profile", icon: getProfileIcon(profilePictureUrl), key: "profile" },
  ];

  if (!userRole) return null;

  // Use if-else instead of nested ternaries
  let navItems;
  if (userRole === "therapist") {
    navItems = therapistNav;
  } else if (userRole === "tourist") {
    navItems = touristNav;
  } else {
    navItems = commonNav;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <ul className="flex justify-around py-2">
        {navItems.map((item) => (
          <li key={item.key} className="cursor-pointer">
            <Link href={item.href}>
              <div className="flex flex-col items-center">{item.icon}</div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNavigation;