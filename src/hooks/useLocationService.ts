// src/app/tourist/hooks/useLocationService.ts
import { useState, useEffect } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface LocationServiceState {
  userLocation: Location | null;
  loading: boolean;
  error: string | null;
}

export const useLocationService = () => {
  const [state, setState] = useState<LocationServiceState>({
    userLocation: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Geolocation APIがブラウザでサポートされているか確認
    if (!navigator.geolocation) {
      setState({
        userLocation: null,
        loading: false,
        error: "Geolocation is not supported by this browser.",
      });
      return;
    }

    // 現在地を取得
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          userLocation: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
            break;
        }
        setState({
          userLocation: null,
          loading: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true, // 高精度な位置情報を要求
        timeout: 10000, // 10秒でタイムアウト
        maximumAge: 0, // キャッシュを使用しない
      },
    );
  }, []);

  return state;
};
