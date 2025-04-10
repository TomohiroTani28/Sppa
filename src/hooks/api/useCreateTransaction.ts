// src/hooks/api/useCreateTransaction.ts
import { gql, useMutation } from "@apollo/client";
import type { Transaction } from "@/types/transaction";

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

interface CreateTransactionVariables {
  bookingId: string;
  guestId: string;
  therapistId: string;
  amount: number;
  currency: string;
  paymentStatus: string; // 必要に応じてenum等に変更可
  paymentMethod?: string;
  gatewayTransactionId?: string;
}

interface CreateTransactionResponse {
  insert_transactions_one: {
    id: string;
    transaction_date: string;
  };
}

export const useCreateTransaction = () => {
  // Apollo Client の useMutation フックは最初の引数に mutation を受け取る
  const [createTransactionMutation, { loading, error }] = useMutation<
    CreateTransactionResponse,
    CreateTransactionVariables
  >(CREATE_TRANSACTION_MUTATION, {
    // エラー発生時のコールバック
    onError: (error) => {
      console.error("Transaction作成に失敗しました:", error);
    },
    // 成功時のコールバック（onSuccess ではなく onCompleted を使用）
    onCompleted: (data) => {
      console.log("Transactionが正常に作成されました:", data);
    },
  });

  /**
   * Transaction を作成する関数
   * @param transaction - Transaction 型のデータ
   * @returns response.data を返す
   */
  const createTransaction = async (transaction: Transaction) => {
    const variables: CreateTransactionVariables = {
      bookingId: transaction.booking_id,
      guestId: transaction.guest_id,
      therapistId: transaction.therapist_id,
      amount: transaction.amount,
      currency: transaction.currency,
      paymentStatus: transaction.payment_status,
      // payment_method と gateway_transaction_id が存在しない場合は undefined として扱う
      paymentMethod: transaction.payment_method ?? undefined,
      gatewayTransactionId: transaction.gateway_transaction_id ?? undefined,
    };

    try {
      const response = await createTransactionMutation({ variables });
      return response.data;
    } catch (err: any) {
      console.error("[useCreateTransaction] Transaction作成エラー:", err);
      throw err;
    }
  };

  return {
    createTransaction,
    isLoading: loading, // Apollo Client では loading プロパティを利用
    error,
  };
};
