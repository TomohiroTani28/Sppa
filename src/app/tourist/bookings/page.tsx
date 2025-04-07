// src/app/tourist/bookings/page.tsx
"use client";
import dynamic from "next/dynamic";

// 完全に異なる名前を使用
export const fetchCache = "force-no-store";
export const revalidate = 0;

// 動的インポート
const BookingsClient = dynamic(() => import("@/app/tourist/bookings/BookingsClient"), { ssr: false });

export default function BookingsPage() {
  return <BookingsClient />;
}