// src/app/therapist/settings/page.tsx
import TherapistLayout from "@/app/therapist/components/TherapistLayout";
import ProfileSettings from "@/app/therapist/profile/components/ProfileSettings";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { AuthUser } from "@/types/auth";

const TherapistSettingsPage = async () => {
  const user = await auth();

  if (!user || user.role !== "therapist") {
    redirect("/tourist/therapists");
  }

  return (
    <TherapistLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">設定</h1>
        <ProfileSettings therapistId={user.id} />
      </div>
    </TherapistLayout>
  );
};

export default TherapistSettingsPage;
