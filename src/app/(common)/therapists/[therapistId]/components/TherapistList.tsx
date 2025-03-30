// src/app/(common)/therapists/[therapistId]/components/TherapistList.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useFetchTherapists } from "@/hooks/api/useFetchTherapists";
import { useTherapistAvailabilityApi } from "@/hooks/api/useTherapistAvailabilityApi";
import { useLikeTherapist } from "@/hooks/api/useLikeTherapist";
import { useRouter, usePathname } from "next/navigation";
import Text from "@/components/ui/Text";
import TherapistCard from "./TherapistCard";
import { TherapistFilter, Therapist } from "@/types/therapist";
import { TherapistAvailabilitySlot, TherapistAvailability } from "@/types/availability";

interface TherapistListProps {
  initialFilter: TherapistFilter;
}

const TherapistList: React.FC<TherapistListProps> = ({ initialFilter }) => {
  const [filter, setFilter] = useState<TherapistFilter>(initialFilter);
  const { therapists, loading, error, refetch } = useFetchTherapists(filter);
  const [availabilityStatuses, setAvailabilityStatuses] = useState<{
    [therapistId: string]: TherapistAvailabilitySlot[];
  }>({});
  const { likeTherapist, loading: likeLoading, error: likeError } = useLikeTherapist();
  const router = useRouter();
  const pathname = usePathname();

  const updateFilterParams = () => {
    const params = new URLSearchParams();
    if (filter.location?.lat) params.set("lat", filter.location.lat.toString());
    if (filter.location?.lng) params.set("lng", filter.location.lng.toString());
    if (filter.service_name) params.set("service", filter.service_name.join(","));
    if (filter.languages) params.set("language", filter.languages.join(","));
    return params;
  };

  useEffect(() => {
    refetch();
    const params = updateFilterParams();
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [filter, refetch, router, pathname]);

  const fetchAvailabilities = async (therapists: Therapist[]) => {
    const statuses: { [therapistId: string]: TherapistAvailabilitySlot[] } = {};
    await Promise.all(
      therapists.map(async (therapist) => {
        const { fetchAvailability } = useTherapistAvailabilityApi(therapist.id);
        const response = await fetchAvailability();
        statuses[therapist.id] = response.available_slots;
      }),
    );
    setAvailabilityStatuses(statuses);
  };

  useEffect(() => {
    if (therapists && therapists.length > 0) {
      fetchAvailabilities(therapists);
    }
  }, [therapists]);

  const renderContent = () => {
    if (loading) return <div>Loading therapists...</div>;
    if (error) return <div>Error loading therapists: {error.message}</div>;
    if (likeLoading) return <div>Liking therapist...</div>;
    if (likeError) return <div>Error liking therapist: {likeError.message}</div>;

    if (!therapists || therapists.length === 0) {
      return (
        <Text className="text-center text-gray-500 py-10">
          条件に合うセラピストが見つかりませんでした。
        </Text>
      );
    }

    const guestId = "YOUR_GUEST_ID"; // 仮のゲストID。実際の実装に応じて修正

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {therapists.map((therapist) => {
          // availabilityStatuses[therapist.id] は TherapistAvailabilitySlot[] なので、
          // TherapistAvailability として渡すためにラップします
          const availability: TherapistAvailability | null =
            availabilityStatuses[therapist.id]
              ? { available_slots: availabilityStatuses[therapist.id] }
              : null;
          return (
            <TherapistCard
              key={therapist.id}
              therapist={therapist}
              availability={availability}
              onLike={() => likeTherapist(guestId, therapist.id)}
              onUnlike={() => {}} // onUnlike の実装が必要な場合は追加してください
            />
          );
        })}
      </div>
    );
  };

  return <>{renderContent()}</>;
};

export default TherapistList;
