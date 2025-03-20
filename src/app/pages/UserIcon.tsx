// src/app/pages/UserIcon.tsx
import React from "react";
import Link from "next/link";
import Avatar from "@/app/components/common/Avatar";

interface UserIconProps {
  userId: string;
  name: string;
  profilePicture: string;
}

const UserIcon: React.FC<UserIconProps> = ({
  userId,
  name,
  profilePicture,
}) => {
  return (
    <Link href={`/profile/${userId}`}>
      <Avatar imageUrl={profilePicture} alt={name} size="sm" />
    </Link>
  );
};

export default UserIcon;
