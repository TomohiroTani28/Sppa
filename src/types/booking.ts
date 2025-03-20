// src/types/booking.ts
export type BookingStatus = 'pending' | 'confirmed' | 'canceled' | 'completed';

export interface Booking {
  id: string;
  guestId: string;
  therapistId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  booking_notes?: string | null;
  therapist?: {
    id: string;
    name: string;
  };
  // その他のフィールド（必要に応じて）
}

export interface BookingInput {
  guestId: string;
  therapistId: string;
  startTime: string;
  endTime: string;
}