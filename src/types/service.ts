// src/types/service.ts
import type { TherapistProfile } from '@/types/therapist';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  therapist_profile: TherapistProfile;
}