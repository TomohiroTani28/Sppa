// src/types/transaction.ts
// import { UUID } from './uuid'; // Remove this line

export type Transaction = {
  id: string; // Use string for UUID
  booking_id: string; // Use string for UUID
  guest_id: string; // Use string for UUID
  therapist_id: string; // Use string for UUID
  amount: number;
  currency: string;
  payment_status: PaymentStatusEnum;
  payment_method: PaymentMethodEnum;
  gateway_transaction_id: string | null;
  created_at: string;
};

export type TransactionCreateInput = {
  booking_id: string; // Use string for UUID
  guest_id: string; // Use string for UUID
  therapist_id: string; // Use string for UUID
  amount: number;
  currency: string;
  payment_status: PaymentStatusEnum;
  payment_method: PaymentMethodEnum;
  gateway_transaction_id?: string;
};

export enum PaymentStatusEnum {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
}

export enum PaymentMethodEnum {
  CreditCard = 'credit_card',
  PayPal = 'paypal',
  Stripe = 'stripe',
  Cash = 'cash',
  Other = 'other',
}