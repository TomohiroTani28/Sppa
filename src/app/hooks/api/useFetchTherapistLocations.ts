// src/app/hooks/api/useFetchTherapistLocations.ts
import { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

// GraphQLクエリの定義
const GET_THERAPIST_LOCATIONS = gql`
  query GetTherapistLocations {
    therapists {
      id
      name
      location {
        lat
        lng
      }
    }
  }
`;

// セラピストの位置情報の型を定義
interface TherapistLocation {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

// APIが失敗した場合のフォールバックデータ
const FALLBACK_DATA: TherapistLocation[] = [
  {
    id: "fallback-1",
    name: "サンプルセラピスト1",
    location: { lat: -8.4095, lng: 115.1889 },
  },
  {
    id: "fallback-2",
    name: "サンプルセラピスト2",
    location: { lat: -8.4195, lng: 115.1989 },
  },
];

export const useFetchTherapistLocations = () => {
  const [retryCount, setRetryCount] = useState(0);
  // 型を指定して状態を初期化
  const [therapistLocations, setTherapistLocations] = useState<TherapistLocation[]>([]);

  // Apollo Clientを使用したデータ取得とエラーハンドリング
  const { loading, error, data, refetch } = useQuery(GET_THERAPIST_LOCATIONS, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.error("GraphQL Error in therapist locations:", error);

      // ネットワークエラー時の自動リトライ（最大3回）
      if (retryCount < 3) {
        const timeout = setTimeout(
          () => {
            setRetryCount((prev) => prev + 1);
            refetch();
          },
          1000 * Math.pow(2, retryCount), // 指数バックオフ
        );

        return () => clearTimeout(timeout);
      }
    },
  });

  useEffect(() => {
    // データが正常に取得できた場合
    if (data?.therapists) {
      setTherapistLocations(data.therapists);
    }
    // エラーがあり、リトライが上限に達した場合、フォールバックデータを使用
    else if (error && retryCount >= 3) {
      console.warn("Using fallback therapist location data after failed retries");
      setTherapistLocations(FALLBACK_DATA);
    }
  }, [data, error, retryCount]);

  return {
    therapistLocations,
    loading,
    error: error && retryCount >= 3 ? error : null, // リトライ後にのみエラーを公開
    refetch,
  };
};