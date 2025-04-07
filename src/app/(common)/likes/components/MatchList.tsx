// src/app/(common)/likes/components/MatchList.tsx
"use client";

import React, { FC } from "react";
import { useRealtimeMatchList } from "@/realtime/useRealtimeMatchList";
import UserCard from "@/components/UserCard";
import { User } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";

const MatchList: FC = () => {
  const { user, loading: authLoading } = useAuth();

  // If authentication is loading, show a loading message
  if (authLoading) {
    return <p>Loading authentication...</p>;
  }

  // If no user is logged in, prompt to log in
  if (!user) {
    return <p>Please log in to see your matches.</p>;
  }

  // At this point, user is guaranteed to be defined, so user.id is a string
  const currentUserId = user.id;

  const { matchList, loading, error } = useRealtimeMatchList(currentUserId);

  // Handle loading and error states from the hook
  if (loading) return <p>Loading matches...</p>;
  if (error) return <p>Error loading matches: {error.message}</p>;

  const matchedUsers: User[] = matchList.map((match: any) => match.matchedUser);

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