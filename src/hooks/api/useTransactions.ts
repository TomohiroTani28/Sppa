// src/hooks/api/useTransactions.ts
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

export interface Transaction {
  id: string;
  booking_id: string;
  guest_id: string;
  therapist_id: string;
  amount: number;
  currency: string;
  payment_status: "pending" | "completed" | "failed";
  payment_method: "credit_card" | "paypal" | "stripe" | "cash" | "other" | null;
  gateway_transaction_id: string | null; // Added for completeness
  created_at: string;
}

const FETCH_TRANSACTIONS_BY_THERAPIST = gql`
  query FetchTransactionsByTherapist($therapistId: String!, $startDate: String) {
    transactions(
      where: {
        therapist_id: { _eq: $therapistId }
        created_at: { _gte: $startDate }
        payment_status: { _eq: "completed" }
      }
    ) {
      id
      booking_id
      guest_id
      therapist_id
      amount
      currency
      payment_status
      payment_method
      gateway_transaction_id
      created_at
    }
  }
`;

export function useTransactions(therapistId: string, period?: string) {
  // Calculate start date based on period
  let startDate: string | undefined;
  if (period) {
    const now = new Date();
    if (period === "month") {
      now.setMonth(now.getMonth() - 1);
    } else if (period === "week") {
      now.setDate(now.getDate() - 7);
    } else if (period === "year") {
      now.setFullYear(now.getFullYear() - 1);
    }
    startDate = now.toISOString();
  }

  const { data, loading, error } = useQuery(FETCH_TRANSACTIONS_BY_THERAPIST, {
    variables: { therapistId, startDate },
    skip: !therapistId,
  });

  return {
    transactions: data ? data.transactions : [],
    loading,
    error,
  };
}