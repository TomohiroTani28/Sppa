// src/app/tourist/bookings/page.tsx
"use client";
import dynamic from "next/dynamic";

// 数値型を使用（関数ではなく実際の数値または定数）
export const revalidate = 0;
export const fetchCache = "force-no-store";

// 動的インポート
const BookingsClient = dynamic(() => import("./BookingsClient"), { ssr: false });

export default function BookingsPage() {
  return <BookingsClient />;
}