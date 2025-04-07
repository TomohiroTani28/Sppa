// src/types/user.ts
import { BaseUser } from './base';

export interface User extends BaseUser {
  image: string | null;
  preferences?: {
    language: string;
    timezone: string;
    notifications: boolean;
  };
  lastLoginAt?: string;
}

export interface Tourist extends User {
  role: "tourist";
  bookingHistory?: string[];
  favoriteTherapists?: string[];
}

export interface Therapist extends User {
  role: "therapist";
  specialties: string[];
  availability: {
    status: "online" | "offline" | "busy";
    schedule: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
  };
  rating: number;
  reviewCount: number;
  services: string[];
  languages: string[];
}

export type UserProfile = Tourist | Therapist;

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
