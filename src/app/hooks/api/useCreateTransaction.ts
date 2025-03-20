// src/app/hooks/api/useCreateTransaction.ts
import { useMutation } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import graphqlClient from "@/app/lib/hasura-client";
import { Transaction } from "@/types/transaction";

const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction(
    $bookingId: uuid!
    $guestId: uuid!
    $therapistId: uuid!
    $amount: numeric!
    $currency: String!
    $paymentStatus: payment_status_enum!
    $paymentMethod: payment_method_enum
    $gatewayTransactionId: String
  ) {
    insert_transactions_one(
      object: {
        booking_id: $bookingId
        guest_id: $guestId
        therapist_id: $therapistId
        amount: $amount
        currency: $currency
        payment_status: $paymentStatus
        payment_method: $paymentMethod
        gateway_transaction_id: $gatewayTransactionId
      }
    ) {
      id
      transaction_date
    }
  }
`;

export const useCreateTransaction = () => {
  const mutation = useMutation({
    mutationFn: async (transaction: Transaction) => {
      const variables = {
        bookingId: transaction.booking_id,
        guestId: transaction.guest_id,
        therapistId: transaction.therapist_id,
        amount: transaction.amount,
        currency: transaction.currency,
        paymentStatus: transaction.payment_status,
        paymentMethod: transaction.payment_method,
        gatewayTransactionId: transaction.gateway_transaction_id,
      };

      try {
        const response = await graphqlClient.mutate({
          mutation: CREATE_TRANSACTION_MUTATION,
          variables,
        });
        return response.data;
      } catch (error) {
        console.error("[useCreateTransaction] Transaction作成エラー:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Transaction作成に失敗しました:", error);
    },
    onSuccess: (data) => {
      console.log("Transactionが正常に作成されました:", data);
    },
  });

  return {
    createTransaction: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
