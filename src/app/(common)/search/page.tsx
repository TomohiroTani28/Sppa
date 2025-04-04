// src/app/(common)/search/page.tsx
"use client";
import dynamic from "next/dynamic";

const SearchClient = dynamic(() => import("./SearchClient"), { ssr: false });

export default function SearchPage() {
  return <SearchClient />;
}