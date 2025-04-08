// src/realtime/useRealtimeTransactions.ts
import type { Transaction } from "@/hooks/api/useTransactions";
import supabase from "@/lib/supabase-client";

/**
 * Subscribe to real-time transaction updates
 */
export function useRealtimeTransactions() {
  const subscribeToTransactionUpdates = (
    transactionId: string,
    callback: (updatedTransaction: Transaction) => void,
  ) => {
    const subscription = supabase
      .channel(`transactions:${transactionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transactions",
          filter: `id=eq.${transactionId}`,
        },
        (payload) => {
          callback(payload.new as Transaction);
        },
      )
      .subscribe();

    // Cleanup subscription on unmount or ID change
    return () => {
      supabase.removeChannel(subscription);
    };
  };

  return { subscribeToTransactionUpdates };
}