// src/app/(tourist)/profile/components/ProfileEdit.tsx
import React, { useState, useEffect } from "react";
import { useFetchUser } from "@/hooks/api/useFetchUser";
import { useUpdateUser } from "@/hooks/api/useUpdateUser";
import Avatar from "@/components/Avatar";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ProfileEditProps {
  userId: string;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ userId }) => {
  const { user, loading, error } = useFetchUser(userId);
  const { updateUser, loading: updating, error: updateError } = useUpdateUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nationality: "",
    languages: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        nationality: user.nationality || "",
        languages: user.languages?.join(", ") || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser(userId, {
      ...formData,
      languages: formData.languages.split(",").map((lang) => lang.trim()),
    });
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;
  if (!user) return <div>ユーザーが見つかりません</div>;

  return (
    <Card className="p-6 shadow-md max-w-lg mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar imageUrl={user.profile_picture || ""} alt={user.name || "Unknown"} size="lg" />
          <div className="flex-1">
            <Label htmlFor="name">名前</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="w-full" />
          </div>
        </div>
        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full" disabled />
        </div>
        <div>
          <Label htmlFor="nationality">国籍</Label>
          <Input id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full" />
        </div>
        <div>
          <Label htmlFor="languages">言語（カンマ区切りで入力）</Label>
          <Input id="languages" name="languages" value={formData.languages} onChange={handleChange} className="w-full" />
        </div>
        <Button type="submit" disabled={updating} className="w-full">
          {updating ? "保存中..." : "保存"}
        </Button>
        {updateError && <p className="text-red-500">{updateError}</p>}
      </form>
    </Card>
  );
};

export default ProfileEdit;
