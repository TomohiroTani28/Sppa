"use client";
// src/app/(therapist)/reviews/page.tsx
import dynamic from "next/dynamic";

const ReviewsClient = dynamic(() => import("./ReviewsClient"), { ssr: false });

export default function ReviewsPage() {
  return <ReviewsClient />;
}