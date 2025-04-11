// src/types/graphql.ts
import { gql } from '@apollo/client';

// Hasuraテーブルの主要な型を定義
export type UUID = string;

export interface User {
  id: UUID;
  name: string;
  email: string;
  profile_picture?: string | null;
  role: 'tourist' | 'therapist' | 'admin' | 'anonymous';
  verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: UUID;
  user_id: UUID;
  content: string;
  post_type: 'general' | 'review' | 'service';
  location?: string | null;
  media_id?: UUID | null;
  created_at: string;
  updated_at: string;
  user?: User;
  media?: Media;
  likes?: Like[];
  comments?: Comment[];
}

export interface Media {
  id: UUID;
  url: string;
  media_type: 'image' | 'video' | 'audio';
  caption?: string | null;
  access_level: 'public' | 'private' | 'restricted';
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: UUID;
  user_id: UUID;
  post_id: UUID;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Comment {
  id: UUID;
  user_id: UUID;
  post_id: UUID;
  content: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface TherapistProfile {
  id: UUID;
  user_id: UUID;
  bio?: string | null;
  experience_years?: number | null;
  location?: string | null;
  languages?: string[];
  certifications?: Record<string, any>;
  working_hours?: Record<string, any>;
  status: 'online' | 'offline' | 'busy';
  last_online_at?: string | null;
  price_range_min?: number | null;
  price_range_max?: number | null;
  currency?: string | null;
  business_name?: string | null;
  address?: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  services?: TherapistService[];
}

export interface TherapistService {
  id: UUID;
  therapist_id: UUID;
  service_name: string;
  description?: string | null;
  duration: number;
  price: number;
  currency: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  therapist?: TherapistProfile;
}

export interface TouristProfile {
  id: UUID;
  user_id: UUID;
  nationality?: string | null;
  languages?: string[];
  interests?: string[];
  travel_dates?: Record<string, any>;
  budget?: number | null;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
  user?: User;
}

// GraphQLフラグメントの定義例
export const USER_FRAGMENT = gql`
  fragment UserFields on users {
    id
    name
    email
    profile_picture
    role
    verified_at
    created_at
    updated_at
  }
`;

export const POST_FRAGMENT = gql`
  fragment PostFields on posts {
    id
    user_id
    content
    post_type
    location
    media_id
    created_at
    updated_at
    user {
      ...UserFields
    }
    media {
      id
      url
      media_type
    }
  }
  ${USER_FRAGMENT}
`;

export interface TherapistsQuery {
    therapist_profiles: Array<{
      user: {
        id: string;
        name: string;
        profile_picture: string;
        therapistProfile?: {
          bio: string;
          experience_years: number;
          location: string;
          languages: string[];
          working_hours: string;
        };
        average_rating: number;
        hourly_rate: number;
        services: Array<{
          id: string;
          service_name: string;
          description: string;
          duration: number;
          price: number;
          currency: string;
          category: string;
        }>;
        reviews: Array<{ id: string }>;
      };
    }>;
  }
  
  export interface TherapistsQueryVariables {
    location?: string;
    service?: string;
    language?: string;
    category?: string;
  }
  
// GraphQLクエリ用の型
export interface PaginationVars {
  limit?: number;
  offset?: number;
}

export interface OrderByVars {
  order_by?: Record<string, 'asc' | 'desc'>;
}

export type WhereVars = Record<string, any>;

export interface QueryVars extends PaginationVars, OrderByVars {
  where?: WhereVars;
}

// Hasuraの標準的な返り値の型
export interface HasuraResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    extensions?: {
      path: string;
      code: string;
    };
  }>;
}
  