// src/app/therapist/page.tsx
import TherapistLayout from "@/app/therapist/components/TherapistLayout";
import DashboardSummary from "@/app/therapist/dashboard/components/DashboardSummary";
import { ActivityLog } from "@/app/therapist/dashboard/components/ActivityLog";
import { auth } from "@/lib/auth.server";
import { redirect } from "next/navigation";

const TherapistDashboardPage = async () => {
  const user = await auth();

  if (!user || user.role !== "therapist") {
    redirect("/tourist/therapists");
  }

  const therapistId = user.id;

  return (
    <TherapistLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
        <DashboardSummary therapistId={therapistId} bookings={[]} />
        <ActivityLog userId={therapistId} /> {/* Changed from therapistId to userId */}
      </div>
    </TherapistLayout>
  );
};

export default TherapistDashboardPage;