// src/types/enums.ts
export enum UserRoleEnum {
  Therapist = 'therapist',
  Tourist = 'tourist',
}

export enum BookingStatusEnum {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Canceled = 'canceled',
  Completed = 'completed',
}

export enum TherapistStatusEnum {
  Online = 'online',
  Offline = 'offline',
  Busy = 'busy',
}

export enum MediaTypeEnum {
  Photo = 'photo',
  Video = 'video',
}

export enum NotificationTypeEnum {
  Like = 'like',
  Match = 'match',
  BookingUpdate = 'booking_update',
  Review = 'review',
  Payment = 'payment',
  Promotion = 'promotion',
}

export enum ReviewTypeEnum {
  Service = 'service',
  General = 'general',
}

export enum PaymentMethodEnum {
  CreditCard = 'credit_card',
  PayPal = 'paypal',
  Stripe = 'stripe',
  Cash = 'cash',
  Other = 'other',
}

export enum PaymentStatusEnum {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
}

export enum error_type_enum {
  API_ERROR = 'api_error',
  VALIDATION_ERROR = 'validation_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error'
}