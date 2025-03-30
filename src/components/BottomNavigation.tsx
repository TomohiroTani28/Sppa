"use client";
// src/components/BottomNavigation.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { getSessionRole } from "@/lib/auth";
import { Home, Search, Calendar, MessageSquare } from "lucide-react";
import Image from "next/image";

interface BottomNavigationProps {
  profilePictureUrl?: string;
  userType?: "tourist" | "therapist" | "common";
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  profilePictureUrl,
  userType,
}) => {
  const [userRole, setUserRole] = useState<"tourist" | "therapist" | "common" | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await getSessionRole();
      setUserRole(role || userType || "tourist");
    };
    fetchRole();
  }, [userType]);

  const commonNav = [
    { href: "/home", icon: <Home className="w-6 h-6" /> },
    { href: "/search", icon: <Search className="w-6 h-6" /> },
    { href: "/activity", icon: <Calendar className="w-6 h-6" /> },
    { href: "/chat", icon: <MessageSquare className="w-6 h-6" /> },
    {
      href: "/profile",
      icon: profilePictureUrl ? (
        <Image
          src={profilePictureUrl}
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold">
          P
        </div>
      ),
    },
  ];

  const touristNav = [
    { href: "/home", icon: <Home className="w-6 h-6" /> },
    { href: "/search", icon: <Search className="w-6 h-6" /> },
    { href: "/tourist/bookings", icon: <Calendar className="w-6 h-6" /> },
    { href: "/chat", icon: <MessageSquare className="w-6 h-6" /> },
    {
      href: "/tourist/profile",
      icon: profilePictureUrl ? (
        <Image
          src={profilePictureUrl}
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold">
          P
        </div>
      ),
    },
  ];

  const therapistNav = [
    { href: "/therapist/dashboard", icon: <Home className="w-6 h-6" /> },
    { href: "/therapist/schedule", icon: <Calendar className="w-6 h-6" /> },
    { href: "/chat", icon: <MessageSquare className="w-6 h-6" /> },
    {
      href: "/therapist/profile",
      icon: profilePictureUrl ? (
        <Image
          src={profilePictureUrl}
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold">
          P
        </div>
      ),
    },
  ];

  if (!userRole) return null;

  const navItems =
    userRole === "therapist" ? therapistNav : userRole === "tourist" ? touristNav : commonNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <ul className="flex justify-around py-2">
        {navItems.map((item, idx) => (
          <li key={idx} className="cursor-pointer">
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