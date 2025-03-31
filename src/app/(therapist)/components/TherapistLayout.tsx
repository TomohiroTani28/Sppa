"use client";
// src/app/(therapist)/components/TherapistLayout.tsx
import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

interface TherapistLayoutProps {
  children: ReactNode;
}

const TherapistLayout: React.FC<TherapistLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Handle active page route
  const isDashboard = pathname.includes("dashboard");
  const isBookings = pathname.includes("bookings");
  const isProfile = pathname.includes("profile");

  return (
    <div className="flex h-screen">
      <Sidebar
        activePage={{
          dashboard: isDashboard,
          bookings: isBookings,
          profile: isProfile,
        }}
      />
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default TherapistLayout;
