// src/app/tourist/home/page.tsx
"use client";
import React, { useEffect } from "react";
import { usePageData } from "@/app/tourist/home/hooks/usePageData";
import { useNotificationCount } from "@/app/tourist/home/hooks/useNotificationCount";
import { useActivityLogging } from "@/app/hooks/api/useActivityLogging";
import HomeHeader from "@/app/components/common/HomeHeader";
import HomeContent from "@/app/components/common/HomeContent";
import BottomNavigation from "@/app/components/common/BottomNavigation";
import { LoadingSpinner } from "@/app/components/common/LoadingSpinner";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface AppUser extends SupabaseUser {
  role: "tourist" | "therapist";
  name: string;
  profilePicture: string;
  email: string;
}

const HomePage: React.FC = () => {
  const {
    user,
    therapists,
    experiences,
    events,
    userLocation,
    transformedPreferences,
    t,
    isLoading,
  } = usePageData();
  const { logActivity } = useActivityLogging();
  const { unreadCount } = useNotificationCount();

  // user が存在しない場合は早期リターン
  if (!user) {
    return <LoadingSpinner />;
  }

  const typedUser: AppUser = {
    ...user,
    role: "tourist" as const,
    name: user.email?.split("@")[0] || "User",
    profilePicture: "",
    email: user.email || "",
  };

  useEffect(() => {
    if (user.id && logActivity) {
      logActivity({
        activityType: "page_visit",
        description: "Visited home page",
      });
    }
  }, [user, logActivity]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <HomeHeader user={typedUser} unreadCount={unreadCount} t={t} />
      <HomeContent
        events={events || []}
        therapists={therapists || []}
        experiences={experiences || []}
        userLocation={userLocation}
        transformedPreferences={transformedPreferences}
      />
      <BottomNavigation userType={typedUser.role} />
    </div>
  );
};

export default HomePage;
