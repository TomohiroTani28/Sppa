// src/app/tourist/profile/components/ProfileView.tsx
import React from "react";
import { useFetchUser } from "@/hooks/api/useFetchUser";
import Avatar from "@/components/Avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";

interface ProfileViewProps {
  userId: string;
}

// ヘッダー部分を切り出す
const ProfileHeader: React.FC<{ user: any }> = ({ user }) => (
  <CardHeader className="flex flex-col sm:flex-row items-center gap-4 pb-0">
    <Avatar imageUrl={user.profile_picture || ""} alt={user.name} size="lg" />
    <div className="text-center sm:text-left">
      <Text className="text-2xl font-bold">{user.name}</Text>
      <Text className="text-sm text-gray-500">{user.email}</Text>
    </div>
  </CardHeader>
);

// コンテンツ部分を切り出す
const ProfileContent: React.FC<{ user: any }> = ({ user }) => (
  <CardContent className="pt-4">
    {/* bio は型に存在しないため、ここでは削除 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Text className="font-medium mb-1">国籍</Text>
        <Text>{user.nationality || "未設定"}</Text>
      </div>
      <div>
        <Text className="font-medium mb-1">言語</Text>
        <Text>{user.languages?.join(", ") || "未設定"}</Text>
      </div>
    </div>
  </CardContent>
);

const ProfileView: React.FC<ProfileViewProps> = ({ userId }) => {
  const { user, loading, error } = useFetchUser(userId);

  if (loading) {
    return (
      <Card className="w-full flex justify-center items-center p-8">
        <Spinner />
      </Card>
    );
  }

  if (error || !user) {
    return (
      <Alert variant="error">
        <span>{error || "ユーザーが見つかりません"}</span>
      </Alert>
    );
  }

  return (
    <Card className="w-full overflow-hidden max-w-2xl mx-auto mt-8">
      <ProfileHeader user={user} />
      <ProfileContent user={user} />
    </Card>
  );
};

export default ProfileView;
