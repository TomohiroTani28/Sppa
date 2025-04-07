// src/types/media.ts
import type { BaseMedia } from './base';

export type MediaType = 'audio' | 'video' | 'document' | 'photo';

export interface Media extends Omit<BaseMedia, 'createdAt' | 'updatedAt'> {
  therapist_id: string;
  patient_id?: string;
  session_id?: string;
  caption?: string;
  description?: string;
  tags?: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
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

export const mapToMedia = (data: any): Media => ({
  id: data.id,
  url: data.url,
  type: data.type,
  thumbnailUrl: data.thumbnail_url ?? null,
  metadata: data.metadata ?? null,
  therapist_id: data.therapist_id,
  patient_id: data.patient_id ?? null,
  session_id: data.session_id ?? null,
  caption: data.caption ?? null,
  description: data.description ?? null,
  tags: data.tags ?? null,
  is_public: data.is_public,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const mapToBaseMedia = (data: any): BaseMedia => ({
  id: data.id,
  url: data.url,
  type: data.type,
  thumbnailUrl: data.thumbnail_url ?? null,
  metadata: data.metadata ?? null,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});