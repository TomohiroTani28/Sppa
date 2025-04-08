"use client";
// src/components/UserCard.tsx
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import type { User } from "@/types/user";
import type { FC } from "react";

interface UserCardProps {
  user: User;
  onLike?: () => void;
  onUnlike?: () => void;
}

const UserCard: FC<UserCardProps> = ({ user, onLike, onUnlike }) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar
            imageUrl={user.profile_picture ?? "/images/default-avatar.png"}
            alt={user.name ?? "Unknown User"}
            size="lg"
          />
          <CardTitle className="text-lg font-bold">{user.name ?? "No Name"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* bioのな情報はUserには現状ないので非表示 */}
        {/* 将来的に tourist_profiles などと組み合わせるなら props 拡張を検討 */}
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        {onLike && (
          <Button variant="outline" onClick={onLike}>
            Like
          </Button>
        )}
        {onUnlike && (
          <Button variant="ghost" onClick={onUnlike}>
            Unlike
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserCard;
