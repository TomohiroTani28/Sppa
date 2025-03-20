// src/types/event.ts
export interface Event {
  id: string;
  therapistId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  discountPercentage?: number;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  therapistId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  discountPercentage?: number;
  imageUrl: string;
}

export interface EventResponse {
  event: Event;
  error?: string;
}
