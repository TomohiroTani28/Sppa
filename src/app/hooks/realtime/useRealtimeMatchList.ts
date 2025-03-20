"use client";
// src/app/hooks/realtime/useRealtimeMatchList.ts
import { gql, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { useUser } from "../api/useUser";
import { Match } from "@/types/match";

const MATCH_LIST_SUBSCRIPTION = gql`
  subscription GetMatchList($userId: uuid!) {
    likes(where: { guest_id: { _eq: $userId }, is_matched: { _eq: true } }) {
      id
      guest_id
      therapist_id
      matched_at
      therapist {
        id
        name
        profile_picture
      }
    }
  }
`;

export const useRealtimeMatchList = (userId: string) => {
  const { user } = useUser(userId); // userId を渡す
  const [matchList, setMatchList] = useState<Match[]>([]);

  const { data, loading, error } = useSubscription(MATCH_LIST_SUBSCRIPTION, {
    variables: { userId },
    skip: !userId, // userId が未定義の場合はサブスクリプションをスキップ
  });

  useEffect(() => {
    if (data?.likes) {
      setMatchList(data.likes);
    }
  }, [data]);

  return { matchList, loading, error };
};