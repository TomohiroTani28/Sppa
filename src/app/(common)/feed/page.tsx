// src/app/(common)/feed/page.tsx
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Suspense } from 'react';
import { FeedWrapper } from './FeedWrapper';

export const dynamic = "force-dynamic";

// フィードページのメインコンポーネント
export default function FeedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <FeedWrapper />
      </Suspense>
    </div>
  );
}
