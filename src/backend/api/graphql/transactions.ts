// src/backend/api/graphql/transactions.ts
import { gql } from '@apollo/client';
import hasuraClient from '@/lib/hasura-client';

// Define the Transaction interface for type safety
interface Transaction {
  id: string;
  amount: number;
  currency: string;
  payment_status: string;
  payment_method: string;
  created_at?: string;
}

// Query to fetch transaction history
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

// Mutation to record a transaction
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

// Function to fetch transactions
export const fetchTransactions = async (therapistId: string): Promise<Transaction[]> => {
  try {
    const client = await hasuraClient();
    const { data } = await client.query({
      query: GET_TRANSACTIONS,
      variables: { therapistId },
    });
    return data.transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error; // Re-throw to allow callers to handle it if needed
  }
};

// Function to record a transaction
export const recordTransaction = async (transactionData: {
  bookingId: string;
  guestId: string;
  therapistId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}): Promise<Transaction> => {
  try {
    const client = await hasuraClient();
    const { data } = await client.mutate({
      mutation: RECORD_TRANSACTION,
      variables: { input: transactionData },
    });
    return data.insert_transactions.returning[0];
  } catch (error) {
    console.error('Error recording transaction:', error);
    throw error; // Re-throw to allow callers to handle it if needed
  }
};