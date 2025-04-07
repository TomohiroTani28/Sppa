// src/app/tourist/bookings/page.tsx
import { Suspense } from "react";
import BookingsClientPage from "./BookingsClient";

// revalidateをサーバーコンポーネントで正しく設定
export const revalidate = 0;

export default function BookingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingsClientPage />
    </Suspense>
  );
}