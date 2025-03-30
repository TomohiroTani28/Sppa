// src/app/(common)/likes/components/LikeButton.tsx
"use client";

import { useState } from "react";
import { useLikeUser } from "@/hooks/api/useLikeUser";
import { Button } from "@/components/ui/Button";

interface LikeButtonProps {
  /** いいねをするユーザのID */
  currentUserId: string;
  /** いいねされる対象ユーザのID */
  targetUserId: string;
  /** 初期状態として「いいね」済みかどうか */
  initialLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  currentUserId,
  targetUserId,
  initialLiked,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);

  // 汎用的な "likeUser / unlikeUser" フック
  // 例: likeUser( likerId, likedUserId )
  //     unlikeUser( likerId, likedUserId )
  const { likeUser, unlikeUser } = useLikeUser();

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeUser(currentUserId, targetUserId);
      } else {
        await likeUser(currentUserId, targetUserId);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error while liking/unliking user:", error);
    }
  };

  return (
    <Button
      onClick={handleLike}
      className={`w-full ${isLiked ? "bg-red-500" : "bg-gray-500"}`}
    >
      {isLiked ? "Unlike" : "Like"}
    </Button>
  );
};

export default LikeButton;
