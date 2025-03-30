// src/app/(common)/components/LocationService.ts
import { useEffect, useState } from "react";

export interface Location {
  lat: number;
  lng: number;
}

export const useLocationService = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ブラウザがGeolocation APIをサポートしているか確認
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    // 現在地を取得
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(`Failed to retrieve location: ${err.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true, // 高精度モードを有効化
        timeout: 10000, // 10秒のタイムアウト
        maximumAge: 0, // キャッシュを使用しない
      },
    );

    // 位置情報を定期的に更新（リアルタイム追跡）
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError(`Location update failed: ${err.message}`);
      },
    );

    // クリーンアップ関数で位置情報の監視を解除
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { userLocation, loading, error };
};
