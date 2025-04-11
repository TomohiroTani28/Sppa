"use client";
// src/app/(common)/feed/page.tsx
import { getInitialFeedData } from '@/actions/feed-actions'; // Server Actionsを別ファイルに移動
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Suspense } from 'react';
import { FeedClient } from './FeedClient';

export const dynamic = "force-dynamic";

// フィードページのメインコンポーネント
export default async function FeedPage() {
  // サーバーサイドで初期データを取得
  const initialPosts = await getInitialFeedData();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <FeedClient initialPosts={initialPosts} />
      </Suspense>
    </div>
  );
}
