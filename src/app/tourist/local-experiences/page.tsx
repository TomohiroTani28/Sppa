// src/app/tourist/local-experiences/page.tsx
import { Suspense } from "react";
import ClientWrapper from "@/app/tourist/local-experiences/ClientWrapper";

// サーバーコンポーネントでのrevalidate設定
export const revalidate = 0;

export default function LocalExperiencesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientWrapper />
    </Suspense>
  );
}