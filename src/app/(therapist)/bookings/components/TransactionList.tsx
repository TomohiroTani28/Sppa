"use client";
// src/app/(therapist)/bookings/components/TransactionList.tsx
import React from "react";
import { useTransactions } from "@/hooks/api/useTransactions";
import { Transaction } from "@/types/transaction";

interface TransactionListProps {
  bookingId: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ bookingId }) => {
  const { transactions, loading, error } = useTransactions(bookingId);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error loading transactions: {error.message}</div>;
  if (!transactions || transactions.length === 0)
    return <p>トランザクションはありません。</p>;

  return (
    <div className="transaction-list">
      <h3>トランザクションリスト</h3>
      <ul>
        {transactions.map((transaction: Transaction) => (
          <li key={transaction.id}>
            <p>トランザクションID: {transaction.id}</p>
            <p>
              金額: {transaction.amount} {transaction.currency}
            </p>
            <p>ステータス: {transaction.payment_status}</p>
            <p>支払い方法: {transaction.payment_method || "未指定"}</p>
            <p>ゲートウェイID: {transaction.gateway_transaction_id || "なし"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;