"use client";
// src/app/(therapist)/profile/components/ProfileSettings.tsx
import React, { useState, useEffect } from "react";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/api/users";
import { User } from "@/types/user";

interface ProfileSettingsProps {
  therapistId: string;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ therapistId }) => {
  const {
    data: userProfile,
    loading,
    error: profileError,
  } = useUserProfile(therapistId);
  const {
    updateUserProfile,
    isLoading,
    error: updateError,
  } = useUpdateUserProfile();

  // userProfile 未取得の場合の初期値は空文字
  const [name, setName] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");

  // userProfile 取得後にフォームの初期値を更新
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setProfilePicture(userProfile.profile_picture || "");
    }
  }, [userProfile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    const updatedProfile: User = {
      ...userProfile, // 既存の情報を保持しつつ上書き
      name,
      profile_picture: profilePicture,
    };
    await updateUserProfile(updatedProfile);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">プロフィール設定</h2>
      {loading ? (
        <div>読み込み中...</div>
      ) : (
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm">
              ユーザー名
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="profilePicture" className="block text-sm">
              プロフィール画像
            </label>
            <input
              type="text"
              id="profilePicture"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "更新中..." : "更新"}
          </button>
        </form>
      )}
      {profileError && (
        <div className="text-red-500 text-sm">{profileError}</div>
      )}
      {updateError && <div className="text-red-500 text-sm">{updateError}</div>}
    </div>
  );
};

export default ProfileSettings;
