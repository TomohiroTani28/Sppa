// src/types/therapist.ts

// セラピストの位置情報を表す型
export interface TherapistLocation {
  lat: number;
  lng: number;
  address: string;
}

// セラピストの資格情報を表す型
export interface TherapistCertification {
  id: string;
  name: string;
  issuer?: string;
  issued_date?: string;
  expiration_date?: string;
}

// セラピストの勤務時間を表す型（オブジェクト形式）
export interface TherapistWorkingHours {
  [day: string]: {
    start: string;
    end: string;
  }[];
}

// セラピストの勤務時間を表す型（配列形式、ServiceDetails.tsx 用）
export interface WorkingHour {
  day: string;
  startTime: string;
  endTime: string;
}

// セラピストが提供するサービスを表す型
export interface TherapistService {
  id: string;
  therapist_id: string;
  service_name: string;
  description?: string;
  duration?: number; // 分単位など
  price: number;
  currency: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// セラピストのメディア（画像、動画など）を表す型
export interface TherapistMedia {
  id: string;
  url: string;
  media_type: "photo" | "video" | "audio" | "document";
  caption?: string;
  is_profile_image?: boolean;
  is_service_image?: boolean;
  is_review_image?: boolean;
  access_level?: "public" | "private";
  created_at?: string;
}

// セラピストのステータスを表す型
export type TherapistStatus = "online" | "offline" | "busy" | "vacation";

// セラピストの詳細情報を表す型
export interface Therapist {
  id: string;
  user_id: string;
  bio?: string;
  experience_years?: number;
  location?: TherapistLocation;
  languages: string[];
  certifications?: Record<string, any>;
  working_hours?: TherapistWorkingHours;
  status: TherapistStatus;
  last_online_at?: string;
  price_range_min?: number;
  price_range_max?: number;
  currency?: string;
  business_name?: string;
  address?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  name: string;
  profile_picture?: string;
  services?: TherapistService[];
  media?: TherapistMedia[];
  price?: number;
}

// セラピストのプロフィール情報を表す型
export interface TherapistProfile {
  id: string;
  user: {
    id: string;
    name: string;
    profile_picture?: string;
  };
  bio?: string;
  location?: string; // TherapistLocationではなく簡略化された文字列
  languages: string[];
  status: "online" | "offline" | "busy" | "vacation";
  price_range_min?: number;
  price_range_max?: number;
  currency?: string;
  average_rating?: {
    aggregate?: {
      avg?: {
        rating?: number;
      };
    };
  };
  booking_count?: {
    aggregate?: {
      count: number;
    };
  };
  workingHours: WorkingHour[];
}

// セラピスト検索結果を表す型
export interface TherapistSearchResult extends TherapistProfile {
  user: {
    id: string;
    name: string;
    profile_picture?: string;
  };
}

// セラピストの可用性を表す型
export interface TherapistAvailability {
  id: string;
  therapist_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  recurrence_rule?: string;
  created_at: string;
  updated_at: string;
}

// TherapistListで使用されるフィルターを表す型
export interface TherapistFilter {
  location?: {
    lat?: number;
    lng?: number;
  };
  service_name?: string[];
  languages?: string[];
}