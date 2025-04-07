// src/app/tourist/profile/page.tsx
import { Suspense } from "react";
import ClientWrapper from "@/app/tourist/profile/ClientWrapper";

// サーバーコンポーネントでのrevalidate設定
export const revalidate = 0;

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientWrapper />
    </Suspense>
  );
}