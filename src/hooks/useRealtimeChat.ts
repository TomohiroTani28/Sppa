"use client";
// src/hooks/useRealtimeChat.ts
/**
 * Custom hook to fetch and subscribe to real-time chat messages.
 * Uses Hasura GraphQL subscriptions for updates.
 */
import { useState, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';
import { RealtimeMessage } from '@/types/chat';

// GraphQL subscription for real-time messages
const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageUpdate($userId: UUID!) {
    realtime_messages(
      where: { _or: [{ sender_id: { _eq: $userId } }, { receiver_id: { _eq: $userId } }] }
      order_by: { sent_at: asc }
    ) {
      id
      sender_id
      receiver_id
      content
      translated_content
      is_read
      sent_at
      read_at
    }
  }
`;

export function useRealtimeChat(userId?: string) {
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, loading: subLoading, error: subError } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (subLoading) {
      setLoading(true);
      return;
    }

    if (subError) {
      setError(subError.message);
      setLoading(false);
      return;
    }

    if (data?.realtime_messages) {
      setMessages(data.realtime_messages);
      setLoading(false);
    }
  }, [data, subLoading, subError]);

  return { messages, loading, error };
}