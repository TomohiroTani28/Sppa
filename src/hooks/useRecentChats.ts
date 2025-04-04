// src/hooks/useRecentChats.ts
import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";

const RECENT_CHATS_SUBSCRIPTION = gql`
  subscription GetRecentChats($userId: UUID!) {
    realtime_messages(
      where: { _or: [{ sender_id: { _eq: $userId } }, { receiver_id: { _eq: $userId } }] }
      order_by: { sent_at: desc }
      limit: 10
    ) {
      id
      sender_id
      receiver_id
      content
      sent_at
      users_receiver: users(where: { id: { _eq: receiver_id } }) {
        name
        profile_picture
      }
    }
  }
`;

export const useRecentChats = () => {
  const userId = "current-user-id"; // 実際には認証コンテキストから取得
  const { data, loading, error } = useSubscription(RECENT_CHATS_SUBSCRIPTION, {
    variables: { userId },
  });
  if (loading) return [];
  if (error) {
    console.error("Recent chats subscription error:", error);
    return [];
  }
  return (
    data?.realtime_messages.map((msg: any) => ({
      id: msg.id,
      receiver_id: msg.receiver_id,
      name: msg.users_receiver[0]?.name,
      profile_picture: msg.users_receiver[0]?.profile_picture,
      content: msg.content,
      sent_at: msg.sent_at,
    })) || []
  );
};