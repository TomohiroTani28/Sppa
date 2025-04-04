// src/app/therapist/bookings/page.tsx
"use client";
import dynamic from "next/dynamic";

const BookingsClient = dynamic(() => import("./BookingsClient"), { ssr: false });

export default function BookingsPage() {
  return <BookingsClient />;
}