// src/backend/api/graphql/transactions.ts
import { gql } from '@apollo/client';
import hasuraClient from '@/lib/hasura-client';

// 取引履歴取得クエリ
const GET_TRANSACTIONS = gql`
  query GetTransactions($therapistId: uuid!) {
    transactions(where: { therapist_id: { _eq: $therapistId } }) {
      id
      amount
      currency
      payment_status
      payment_method
      created_at
    }
  }
`;

// 取引を記録するミューテーション
const RECORD_TRANSACTION = gql`
  mutation RecordTransaction($input: transactions_insert_input!) {
    insert_transactions(objects: [$input]) {
      returning {
        id
        amount
        payment_status
        payment_method
      }
    }
  }
`;

// 取引を取得する関数
export const fetchTransactions = async (therapistId: string) => {
  const { data } = await hasuraClient.query({
    query: GET_TRANSACTIONS,
    variables: { therapistId },
  });
  return data.transactions;
};

// 取引を記録する関数 (引数をオブジェクト化)
export const recordTransaction = async (transactionData: {
  bookingId: string;
  guestId: string;
  therapistId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}) => {
  const { data } = await hasuraClient.mutate({
    mutation: RECORD_TRANSACTION,
    variables: { input: transactionData },
  });
  return data.insert_transactions.returning[0];
};
