// src/types/event.ts
import type { BaseEvent, BaseMedia } from './base';

export interface Event extends BaseEvent {
  therapistId: string;
  imageUrl: string;
  discountPercentage?: number;
  location?: string;
  capacity: number;
  currentParticipants: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  media?: BaseMedia[];
  tags?: string[];
}

export interface EventInput {
  therapistId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  discountPercentage?: number;
  location?: string;
  capacity: number;
  tags?: string[];
}

export interface EventResponse {
  event: Event;
  error?: string;
}
