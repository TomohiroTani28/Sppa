// src/app/tourist/likes/components/MatchList.tsx
import { FC } from "react";
import { useRealtimeMatchList } from "@app/hooks/realtime/useRealtimeMatchList";
import TherapistCard from "@app/tourist/therapists/components/TherapistCard";
import { Therapist } from "@/types/therapist";
import { TherapistAvailabilitySlot } from "@/types/availability";

// 仮に userId を取得する方法としてコンテキストやpropsを使用
// ここでは仮の値を使用
const currentUserId = "YOUR_CURRENT_USER_ID";

const MatchList: FC = () => {
  const { matchList, loading, error } = useRealtimeMatchList(currentUserId);

  if (loading) return <p>Loading matches...</p>;
  if (error) return <p>Error loading matches: {error.message}</p>;

  const therapists: Therapist[] = matchList.map((match) => ({
    ...match.therapist,
    bio: "",
    rating: 0,
    languages: [],
    status: "online" as const,
    user_id: match.therapist_id,
    experience_years: 0,
    price_range_min: 0,
    price_range_max: 0,
    currency: "USD",
    // matched_at が undefined の場合は空文字列を使用
    created_at: match.matched_at ?? "",
    updated_at: match.matched_at ?? "",
  }));

  return (
    <div className="space-y-4">
      {therapists.length === 0 ? (
        <p>No matches yet</p>
      ) : (
        therapists.map((therapist) => (
          <TherapistCard
            key={therapist.id}
            therapist={therapist}
            availability={{ available_slots: [] }}
            onLike={() => {}}
            onUnlike={() => {}}
          />
        ))
      )}
    </div>
  );
};

export default MatchList;
