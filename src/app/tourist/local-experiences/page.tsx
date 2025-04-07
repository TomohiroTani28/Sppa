// src/app/tourist/local-experiences/page.tsx
import { Suspense } from "react";
import dynamic from "next/dynamic";

// サーバーコンポーネントでのrevalidate設定
export const revalidate = 0;

// クライアントコンポーネントの動的インポート
const LocalExperiencesClient = dynamic(() => import("./LocalExperiencesClient"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function LocalExperiencesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LocalExperiencesClient />
    </Suspense>
  );
}