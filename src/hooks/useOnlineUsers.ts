// src/app/(common)/chat/hooks/useOnlineUsers.ts
import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";

const ONLINE_USERS_SUBSCRIPTION = gql`
  subscription GetOnlineUsers {
    users(where: { therapist_profiles: { status: { _eq: "online" } } }) {
      id
      name
      profile_picture
    }
  }
`;

export const useOnlineUsers = () => {
  const { data, loading, error } = useSubscription(ONLINE_USERS_SUBSCRIPTION);
  if (loading) return [];
  if (error) {
    console.error("Online users subscription error:", error);
    return [];
  }
  return data?.users || [];
};