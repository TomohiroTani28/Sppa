// src/types/media.ts
export interface Media {
  id: string;
  therapist_id: string;
  media_type: 'photo' | 'video' | 'audio' | 'document';
  url: string;
  caption?: string;
  is_profile_image: boolean;
  is_service_image: boolean;
  is_review_image: boolean;
  access_level: 'public' | 'private';
  created_at: string;
}

export interface MediaFilterOptions {
  therapist_id?: string;
  media_type?: 'photo' | 'video' | 'audio' | 'document' | ('photo' | 'video' | 'audio' | 'document')[];
  is_profile_image?: boolean;
  is_service_image?: boolean;
  is_review_image?: boolean;
  access_level?: 'public' | 'private';
}

export interface MediaUploadParams {
  therapist_id: string;
  file: File;
  media_type: 'photo' | 'video' | 'audio' | 'document';
  caption?: string;
  is_profile_image?: boolean;
  is_service_image?: boolean;
  is_review_image?: boolean;
  access_level?: 'public' | 'private';
}

export interface MediaUpdateParams {
  id: string;
  caption?: string;
  is_profile_image?: boolean;
  is_service_image?: boolean;
  is_review_image?: boolean;
  access_level?: 'public' | 'private';
}

export interface ServiceMedia {
  id: string;
  service_id: string;
  media_id: string;
  order_index: number;
  media?: Media;
}

export interface EventMedia {
  id: string;
  event_id: string;
  media_id: string;
  order_index: number;
  media?: Media;
}

export interface LocalExperienceMedia {
  id: string;
  local_experience_id: string;
  media_id: string;
  order_index: number;
  media?: Media;
}

export interface MediaUploadResponse {
  id: string;
  url: string;
  success: boolean;
  error?: string;
}

export interface MediaBulkUploadResponse {
  successful: MediaUploadResponse[];
  failed: {
    file: File;
    error: string;
  }[];
}