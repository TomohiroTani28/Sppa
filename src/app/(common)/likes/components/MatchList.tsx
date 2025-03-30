// src/app/(common)/likes/components/MatchList.tsx
"use client";

import React, { FC } from "react";
import { useRealtimeMatchList } from "@/realtime/useRealtimeMatchList";
import UserCard from "@/components/UserCard"; 
// ↑ TherapistCardではなく「ユーザカード」として汎用化する想定
import { User } from "@/types/user";

// 仮にログイン中のユーザIDを取得する処理
// 実際には useAuth() 等から取得してください
const currentUserId = "CURRENT_USER_ID";

const MatchList: FC = () => {
  const { matchList, loading, error } = useRealtimeMatchList(currentUserId);

  if (loading) return <p>Loading matches...</p>;
  if (error) return <p>Error loading matches: {error.message}</p>;

  // matchList の構造はアプリの仕様次第ですが、例として:
  // [{ matchedUser: {...}, matchedAt: "2025-01-01" }, ... ] の形を想定
  // DB/スキーマに合わせて調整してください。
  const matchedUsers: User[] = matchList.map((match: any) => ({
    ...match.matchedUser,
    // もし "therapist_id" や "guest_id" 等があれば rename
    // role: match.matchedUser.role,
    // created_at, updated_at などを補完
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
            // 例: カード内で LikeButton を使う or "onLike" コールバックを定義
            onLike={() => {/* handle like logic */}}
            onUnlike={() => {/* handle unlike logic */}}
          />
        ))
      )}
    </div>
  );
};

export default MatchList;
