// src/app/(common)/search/components/TrendDisplay.tsx
"use client";

import React from "react";
import { useFetchTrends } from "@/hooks/api/useFetchTrends";
import { useRouter } from "next/navigation";

const TrendDisplay: React.FC = () => {
  const { trends, loading } = useFetchTrends();
  const router = useRouter();

  if (loading)
    return <div className="text-gray-500">トレンドをロード中...</div>;

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">トレンド検索</h3>
      <div className="flex flex-wrap gap-2">
        {trends.map((trend) => (
          <button
            key={trend}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition-colors"
            onClick={() =>
              router.push(`/tourist/search?query=${encodeURIComponent(trend)}`)
            }
          >
            {trend}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendDisplay;
