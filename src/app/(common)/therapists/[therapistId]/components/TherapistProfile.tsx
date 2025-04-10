"use client";
// src/app/(common)/therapists/[therapistId]/components/TherapistProfile.tsx
import Avatar from "@/components/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

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

interface ProfileSectionProps {
  readonly title: string;
  readonly content: string | JSX.Element;
}

// Reusable Profile Section Component
function ProfileSection({ title, content }: ProfileSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {typeof content === "string" ? <p className="text-gray-700">{content}</p> : content}
    </div>
  );
}

// Sub-component for Bio
function BioSection({ bio, t }: { readonly bio: string; readonly t: (key: string, options?: any) => string }) {
  return <ProfileSection title={t("profile.bio")} content={bio} />;
}

// Sub-component for Business Info
function BusinessSection({
  business_name,
  address,
  t,
}: {
  readonly business_name: string;
  readonly address?: string;
  readonly t: (key: string, options?: any) => string;
}) {
  return (
    <ProfileSection
      title={t("profile.business")}
      content={
        <>
          <p>{business_name}</p>
          {address && <p className="text-gray-600">{address}</p>}
        </>
      }
    />
  );
}

// Process Availability Data
function processAvailabilityData(availability: any[]) {
  const isAvailable = Boolean(availability.some((slot) => slot.is_available));
  const hasNextAvailableTime = Boolean(availability.length > 0);
  const nextAvailableTime = hasNextAvailableTime ? availability[0].start_time : undefined;

  return { isAvailable, hasNextAvailableTime, nextAvailableTime };
}

// Generate Availability Text
function getAvailabilityText(
  t: (key: string, options?: any) => string,
  isAvailable: boolean,
  hasNextAvailableTime: boolean,
  nextAvailableTime?: string
): string {
  if (isAvailable) {
    return t("profile.available_now");
  } else if (hasNextAvailableTime) {
    return t("profile.next_available", { time: nextAvailableTime });
  } else {
    return t("profile.not_available");
  }
}

// Main Component
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
  const availabilityText = getAvailabilityText(t, isAvailable, hasNextAvailableTime, nextAvailableTime);

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader className="flex flex-col items-center">
        <div className="w-24 h-24 mb-4">
          <Avatar
            imageUrl={therapist.user.profile_picture ?? "/images/user1.jpg"}
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
        {therapist.bio && <BioSection bio={therapist.bio} t={t} />}
        {therapist.business_name && (
          <BusinessSection business_name={therapist.business_name} address={therapist.address || ""} t={t} />
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
                  <li key={key}>{typeof cert === "string" ? cert : cert.name ?? key}</li>
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