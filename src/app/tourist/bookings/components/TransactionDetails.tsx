// src/app/tourist/bookings/components/TransactionDetails.tsx
import React, { useState, useEffect } from "react";
import { useTransactions } from "@/hooks/api/useTransactions";
import { useRealtimeTransactions } from "@/realtime/useRealtimeTransactions";

interface TransactionDetailsProps {
  transactionId: string;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transactionId,
}) => {
  const [transaction, setTransaction] = useState<any>(null);
  const { transactions, loading } = useTransactions(transactionId);
  const { subscribeToTransactionUpdates } = useRealtimeTransactions();

  useEffect(() => {
    if (transactions.length) {
      setTransaction(transactions[0]);
    }
  }, [transactions]);

  useEffect(() => {
    subscribeToTransactionUpdates(transactionId, (updatedTransaction) => {
      setTransaction(updatedTransaction);
    });
  }, [transactionId, subscribeToTransactionUpdates]);

  if (loading || !transaction) return <div>Loading...</div>;

  return (
    <div className="transaction-details">
      <h2>Transaction Details</h2>
      <p>
        Amount: {transaction.amount} {transaction.currency}
      </p>
      <p>Status: {transaction.payment_status}</p>
      <p>Payment Method: {transaction.payment_method}</p>
      <p>Transaction ID: {transaction.gateway_transaction_id}</p>
    </div>
  );
};

export default TransactionDetails;