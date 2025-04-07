// src/app/tourist/preferences/page.tsx
import { Suspense } from "react";
import ClientWrapper from "@/app/tourist/preferences/ClientWrapper";

// サーバーコンポーネントでのrevalidate設定
export const revalidate = 0;

export default function PreferencesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientWrapper />
    </Suspense>
  );
}