// src/types/preference.ts
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

export interface PreferenceSettings {
  preferred_services: string[];
  preferred_duration: number;
  preferred_budget: number;
  preferred_languages: string[];
  gender_preference?: string;
  amenities_preference?: any;
  language?: string;
  time_zone?: string;
}
