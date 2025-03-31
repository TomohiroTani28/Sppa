// src/types/availability.ts

export interface TherapistAvailabilitySlot {
  id: string;
  therapist_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  updated_at?: string;
}

export interface TherapistAvailability {
  available_slots: TherapistAvailabilitySlot[];
  is_available?: boolean;
}