// src/app/(therapist)/components/Sidebar.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface SidebarProps {
  activePage: {
    dashboard: boolean;
    bookings: boolean;
    profile: boolean;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", path: "/therapist/dashboard" },
    { name: "Bookings", path: "/therapist/bookings" },
    { name: "Profile", path: "/therapist/profile" },
  ];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-semibold">Therapist Dashboard</h2>
      </div>
      <nav className="flex flex-col p-4">
        {navItems.map((item) => (
          <Link key={item.name} href={item.path}>
            <a
              className={`p-2 text-lg rounded-md my-2 ${
                activePage[item.name.toLowerCase() as keyof typeof activePage]
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {item.name}
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
