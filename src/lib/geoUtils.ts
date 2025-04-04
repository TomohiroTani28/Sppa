// src/lib/geoUtils.ts

/**
 * ハバーサイン公式を使用して2点間の距離を計算する
 * @param point1 緯度・経度を持つ最初の点 { lat: number, lng: number }
 * @param point2 緯度・経度を持つ2番目の点 { lat: number, lng: number }
 * @returns キロメートル単位での距離
 */
export function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number },
): number {
  const R = 6371; // 地球の半径（キロメートル）
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
      Math.cos(toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Number(distance.toFixed(2)); // 小数点以下2桁で返す
}

/**
 * 度数をラジアンに変換する
 * @param degrees 度数
 * @returns ラジアン
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * JSONB形式の位置データをパースして緯度・経度オブジェクトに変換する
 * @param location JSONB形式の位置データ（例: {"lat": -8.4095, "lng": 115.1889, "address": "Jl. Example"})
 * @returns { lat: number, lng: number } または null（無効なデータの場合）
 */
export function parseLocation(
  location: any,
): { lat: number; lng: number } | null {
  if (
    !location ||
    typeof location !== "object" ||
    !("lat" in location) ||
    !("lng" in location)
  ) {
    return null;
  }

  const lat = Number(location.lat);
  const lng = Number(location.lng);

  if (
    isNaN(lat) ||
    isNaN(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return null;
  }

  return { lat, lng };
}

/**
 * 距離をフォーマットして表示する
 * @param distance キロメートル単位の距離
 * @returns フォーマットされた距離文字列（例: "5.2 km" または "Unknown"）
 */
export function formatDistance(distance: number | "Unknown"): string {
  if (distance === "Unknown") return "Unknown";
  return `${distance} km`;
}

/**
 * 複数のポイントから最も近いものを検索する
 * @param userLocation ユーザーの現在地 { lat: number, lng: number }
 * @param points 位置情報の配列
 * @returns 最も近いポイントとその距離 { point: any, distance: number } または null
 */
export function findNearestPoint(
  userLocation: { lat: number; lng: number },
  points: any[],
): { point: any; distance: number } | null {
  if (!userLocation || !points || points.length === 0) return null;

  let nearestPoint = null;
  let minDistance = Infinity;

  for (const point of points) {
    const parsedLocation = parseLocation(point.location);
    if (!parsedLocation) continue;

    const dist = calculateDistance(userLocation, parsedLocation);
    if (dist < minDistance) {
      minDistance = dist;
      nearestPoint = point;
    }
  }

  return nearestPoint ? { point: nearestPoint, distance: minDistance } : null;
}
