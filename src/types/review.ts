// src/types/review.ts
// レビュー関連のインターフェース
export interface TherapistInfo {
  id: string;
  name: string;
  profile_picture?: string;
}

export interface ServiceInfo {
  id: string;
  service_name: string;
  duration?: number;
  price?: number;
  currency?: string;
}

export interface Review {
  id: string;
  booking_id: string;
  guest_id: string;
  therapist_id: string;
  rating: number;
  comment: string;
  review_type: 'service' | 'general';
  media_urls: string[];
  is_anonymous: boolean;
  created_at: string;
  date?: string; // UIでの表示用
  
  // 関連情報（JOINなどで取得）
  therapist?: TherapistInfo;
  service?: ServiceInfo;
}

// バックエンドから取得した生データ型
export interface RawReview {
  id: string;
  booking_id: string;
  guest_id: string;
  therapist_id: string;
  rating: string; // PostgreSQLのDECIMAL型はStringとして返ってくる
  comment: string | null;
  review_type: 'service' | 'general';
  media_urls: string[] | null;
  is_anonymous: boolean;
  created_at: string;
  
  // リレーション
  therapist?: {
    id: string;
    name: string;
    profile_picture: string | null;
  } | null;
  booking?: {
    id: string;
    service?: {
      id: string;
      service_name: string;
      price?: string;
      duration?: number;
      currency?: string;
    } | null;
  } | null;
}

// レビュー作成時のデータ型
export interface CreateReviewInput {
  booking_id: string;
  guest_id: string;
  therapist_id: string;
  rating: number;
  comment?: string;
  review_type: 'service' | 'general';
  media_urls?: string[];
  is_anonymous?: boolean;
}

// レビュー更新時のデータ型
export interface UpdateReviewInput {
  id: string;
  rating?: number;
  comment?: string;
  media_urls?: string[];
  is_anonymous?: boolean;
}

// レビュー統計情報
export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    rating_1: number;
    rating_2: number;
    rating_3: number;
    rating_4: number;
    rating_5: number;
  };
}