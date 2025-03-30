// src/app/therapist/profile/components/ProfileForm.tsx
import { useState, useEffect } from "react";
import { useUser } from "@/app/hooks/api/useUser";
import supabase from "@/app/lib/supabase-client";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

// Define a type for the profile data to update (subset of TherapistProfile)
interface ProfileUpdateData {
  name: string;
  bio: string;
  profile_picture: string; // Changed from avatar to match UserProfile
}

// Function to update user profile
async function updateUserProfile({ name, bio, profile_picture }: ProfileUpdateData) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw authError || new Error("User not authenticated");

  const { error } = await supabase
    .from("therapist_profiles")
    .update({ name, bio })
    .eq("user_id", user.id);

  if (error) throw error;

  // Update profile_picture in the users table if needed
  const { error: userError } = await supabase
    .from("users")
    .update({ profile_picture })
    .eq("id", user.id);

  if (userError) throw userError;
}

const ProfileForm = () => {
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch authenticated user ID
  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching auth user:", error);
        return;
      }
      setUserId(user?.id || null);
    };
    fetchUserId();
  }, []);

  // Fetch user profile with userId
  const { user, loading, error } = useUser(userId || "");

  // Initialize state with user data
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.therapist_profiles?.[0]?.bio || "");
  const [profilePicture] = useState(user?.profile_picture || ""); // Changed from avatar

  // Update state when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.therapist_profiles?.[0]?.bio || "");
    }
  }, [user]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setBio(e.target.value);

  const handleSubmit = async () => {
    try {
      await updateUserProfile({ name, bio, profile_picture: profilePicture });
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading || !userId) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <div className="mb-4">
        <img
          src={profilePicture}
          alt="User Avatar"
          className="w-16 h-16 rounded-full mb-2"
        />
        <Input
          value={name}
          onChange={handleNameChange}
          placeholder="Your name"
          className="mt-2"
        />
      </div>
      <div className="mb-4">
        <textarea
          value={bio}
          onChange={handleBioChange}
          placeholder="Tell us about yourself"
          className="w-full h-24 p-2 border rounded-md"
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">
        Save Changes
      </Button>
    </div>
  );
};

export default ProfileForm;