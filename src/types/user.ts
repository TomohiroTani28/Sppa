// src/types/user.ts
export interface User {
  id: string;
  name: string | null;
  email: string;
  password_hash: string;
  role: 'therapist' | 'tourist';
  profile_picture: string | null;
  phone_number?: string;
  verified_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TouristProfile {
  id: string;
  user_id: string;
  nationality: string;
  languages: string[];
  interests: any;
  travel_dates?: {
    start_date: string;
    end_date: string;
  };
  budget?: number;
  preferences?: any;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_services: string[];
  preferred_duration: number;
  preferred_budget: number;
  preferred_languages: string[];
  gender_preference: string;
  amenities_preference: any;
  language?: string;
  time_zone?: string;
  created_at: string;
  updated_at: string;
}
