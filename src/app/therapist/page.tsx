// src/app/therapist/page.tsx
import TherapistLayout from "@/app/therapist/components/TherapistLayout";
import DashboardSummary from "@/app/therapist/dashboard/components/DashboardSummary";
import ActivityLog from "@/app/therapist/dashboard/components/ActivityLog";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

const TherapistDashboardPage = async () => {
  // Assuming auth() returns a User directly, not a session with a nested user property
  const user = await auth();

  if (!user || user.role !== "therapist") {
    redirect("/tourist/therapists");
  }

  const therapistId = user.id as string; // Explicit type as string

  return (
    <TherapistLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
        {/* Ensure to pass the bookings prop as required */}
        <DashboardSummary therapistId={therapistId} bookings={[]} />
        <ActivityLog therapistId={therapistId} />
      </div>
    </TherapistLayout>
  );
};

export default TherapistDashboardPage;
