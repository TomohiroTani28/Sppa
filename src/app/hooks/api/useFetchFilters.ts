// src/app/hooks/api/useFetchFilters.ts
import { useState, useEffect } from "react";

export interface FilterOption {
  id: string;
  label: string;
  values: string[];
}

export const useFetchFilters = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // ここで実際のAPIからフィルター情報を取得します
        // 例としてモックデータを返します
        const mockData: FilterOption[] = [
          {
            id: "category",
            label: "カテゴリー",
            values: ["観光地", "グルメ", "ショッピング", "アクティビティ"],
          },
          {
            id: "area",
            label: "エリア",
            values: ["東京", "大阪", "京都", "北海道", "沖縄"],
          },
          {
            id: "price",
            label: "価格帯",
            values: ["無料", "~¥1,000", "¥1,000~¥5,000", "¥5,000~"],
          },
        ];

        // APIレスポンスの遅延をシミュレート
        setTimeout(() => {
          setFilterOptions(mockData);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred"),
        );
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return { filterOptions, loading, error };
};
