// src/types/availability.ts

export interface TherapistAvailabilitySlot {
  id: string;
  therapist_id: string;
  start_time: string; // ISO8601 string
  end_time: string; // ISO8601 string
  is_available: boolean;
  updated_at?: string; // optional
}

export interface TherapistAvailability {
  available_slots: TherapistAvailabilitySlot[];
  is_available?: boolean; // 現在利用可能かどうかのフラグ
}