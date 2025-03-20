"use client";
// src/app/(common)/therapists/[therapistId]/components/TherapistProfile.tsx
import { useQuery, useSubscription, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { cn } from "@/app/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import { Spinner } from "@/app/components/ui/Spinner";
import { useTranslation } from "next-i18next";
import Avatar from "@/app/components/common/Avatar";

// GraphQL Queries and Subscriptions
const GET_THERAPIST_PROFILE = gql`
  query GetTherapistProfile($id: uuid!) {
    therapist_profiles_by_pk(id: $id) {
      id
      user_id
      bio
      languages
      working_hours
      status
      location
      experience_years
      price_range_min
      price_range_max
      currency
      business_name
      address
      last_online_at
      certifications
      user {
        name
        profile_picture
      }
    }
  }
`;

const THERAPIST_AVAILABILITY_SUBSCRIPTION = gql`
  subscription OnTherapistAvailability($therapistId: uuid!) {
    therapist_availability(where: { therapist_id: { _eq: $therapistId } }) {
      id
      start_time
      end_time
      is_available
    }
  }
`;

// Types
interface TherapistProfile {
  id: string;
  user_id: string;
  bio?: string;
  languages: string[];
  working_hours: { day: string; startTime: string; endTime: string }[];
  status: "online" | "offline" | "busy" | "vacation";
  location?: string;
  experience_years?: number;
  price_range_min?: number;
  price_range_max?: number;
  currency?: string;
  business_name?: string;
  address?: string;
  last_online_at?: string;
  certifications?: Record<string, { name?: string } | string>;
  user: { name: string; profile_picture?: string };
}

interface TherapistProfileProps {
  readonly therapistId: string;
  readonly className?: string;
}

// サブコンポーネントに分割して複雑さを軽減
interface ProfileSectionProps {
  readonly title: string;
  readonly content: string | JSX.Element;
}

function ProfileSection({ title, content }: ProfileSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {typeof content === "string" ? <p className="text-gray-700">{content}</p> : content}
    </div>
  );
}

// 可用性データを処理する関数を分離して複雑さを軽減
function processAvailabilityData(availability: any[]) {
  // Boolean conversion to fix TS6439
  const isAvailable = Boolean(availability.some((slot) => slot.is_available));
  const hasNextAvailableTime = Boolean(availability.length > 0);
  const nextAvailableTime = hasNextAvailableTime ? availability[0].start_time : undefined;
  
  return { isAvailable, hasNextAvailableTime, nextAvailableTime };
}

// メインコンポーネント
export default function TherapistProfile({ therapistId, className }: TherapistProfileProps) {
  const { t } = useTranslation("common");
  const { data: profileData, loading, error } = useQuery<{
    therapist_profiles_by_pk: TherapistProfile;
  }>(GET_THERAPIST_PROFILE, {
    variables: { id: therapistId },
    skip: !therapistId,
  });
  const { data: availabilityData } = useSubscription(THERAPIST_AVAILABILITY_SUBSCRIPTION, {
    variables: { therapistId },
    skip: !therapistId,
  });

  const [availability, setAvailability] = useState<any[]>([]);

  useEffect(() => {
    if (availabilityData?.therapist_availability) {
      setAvailability(availabilityData.therapist_availability);
    }
  }, [availabilityData]);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  if (error || !profileData?.therapist_profiles_by_pk) {
    return <div className="text-red-500 text-center">{t("errors.profile_fetch_failed")}</div>;
  }

  const therapist = profileData.therapist_profiles_by_pk;
  const { isAvailable, hasNextAvailableTime, nextAvailableTime } = processAvailabilityData(availability);

  // 可用性テキストを計算
  let availabilityText: string;
  if (isAvailable) {
    availabilityText = t("profile.available_now");
  } else if (hasNextAvailableTime) {
    availabilityText = t("profile.next_available", { time: nextAvailableTime });
  } else {
    availabilityText = t("profile.not_available");
  }

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader className="flex flex-col items-center">
        <div className="w-24 h-24 mb-4">
          <Avatar 
            imageUrl={therapist.user.profile_picture || "/images/user1.jpg"} 
            alt={therapist.user.name} 
            size="lg"
          />
        </div>
        <CardTitle className="text-2xl font-bold">{therapist.user.name}</CardTitle>
        <Badge
          variant={therapist.status === "online" ? "default" : "outline"}
          className={cn(
            therapist.status === "online" ? "bg-green-500 text-white" : "text-gray-500"
          )}
        >
          {t(`therapist_status.${therapist.status}`)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {therapist.bio && <ProfileSection title={t("profile.bio")} content={therapist.bio} />}
        {therapist.business_name && (
          <ProfileSection
            title={t("profile.business")}
            content={
              <>
                <p>{therapist.business_name}</p>
                {therapist.address && <p className="text-gray-600">{therapist.address}</p>}
              </>
            }
          />
        )}
        {therapist.languages.length > 0 && (
          <ProfileSection
            title={t("profile.languages")}
            content={
              <div className="flex flex-wrap gap-2">
                {therapist.languages.map((lang, index) => (
                  <Badge key={`${lang}-${index}`} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            }
          />
        )}
        {therapist.price_range_min && therapist.price_range_max && (
          <ProfileSection
            title={t("profile.price_range")}
            content={`${therapist.price_range_min} - ${therapist.price_range_max} ${therapist.currency}`}
          />
        )}
        {therapist.experience_years && (
          <ProfileSection
            title={t("profile.experience")}
            content={t("profile.years_experience", { count: therapist.experience_years })}
          />
        )}
        {therapist.certifications && (
          <ProfileSection
            title={t("profile.certifications")}
            content={
              <ul className="list-disc pl-5">
                {Object.entries(therapist.certifications).map(([key, cert]) => (
                  <li key={key}>{typeof cert === "string" ? cert : cert.name || key}</li>
                ))}
              </ul>
            }
          />
        )}
        <ProfileSection title={t("profile.availability")} content={availabilityText} />
      </CardContent>
    </Card>
  );
}