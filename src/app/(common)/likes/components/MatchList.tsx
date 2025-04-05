// src/app/(common)/likes/components/MatchList.tsx
"use client";

import React, { FC } from "react";
import { useRealtimeMatchList } from "@/realtime/useRealtimeMatchList";
import UserCard from "@/components/UserCard";
import { User } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";

const MatchList: FC = () => {
  const { user, loading: authLoading } = useAuth();
  const currentUserId = user?.id || null;

  const { matchList, loading, error } = useRealtimeMatchList(currentUserId);

  if (authLoading || loading) return <p>Loading matches...</p>;
  if (error) return <p>Error loading matches: {error.message}</p>;

  const matchedUsers: User[] = matchList.map((match: any) => ({
    ...match.matchedUser,
  }));

  return (
    <div className="space-y-4">
      {matchedUsers.length === 0 ? (
        <p>No matches yet</p>
      ) : (
        matchedUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onLike={() => {/* handle like logic */}}
            onUnlike={() => {/* handle unlike logic */}}
          />
        ))
      )}
    </div>
  );
};

export default MatchList;