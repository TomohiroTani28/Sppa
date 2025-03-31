"use client";
// src/components/TherapistAvailabilityStatus.tsx
import { gql } from "@apollo/client";
import { useWebSocketSubscription } from "@/hooks/useWebSocketSubscription";

// GraphQL subscription for therapist availability
const THERAPIST_AVAILABILITY_SUBSCRIPTION = gql`
  subscription TherapistAvailabilitySubscription($therapistId: uuid!) {
    therapist_profiles(where: { user_id: { _eq: $therapistId } }) {
      id
      status
      last_online_at
    }
  }
`;

interface TherapistProfileData {
  therapist_profiles: {
    id: string;
    status: string;
    last_online_at: string;
  }[];
}

export function TherapistAvailabilityStatus({
  therapistId,
}: {
  therapistId: string;
}) {
  const { data, loading, error } =
    useWebSocketSubscription<TherapistProfileData>({
      query: THERAPIST_AVAILABILITY_SUBSCRIPTION,
      variables: { therapistId },
    });

  if (loading) return <div>Loading status...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || data.therapist_profiles.length === 0)
    return <div>No data available</div>;

  const { status, last_online_at } = data.therapist_profiles[0];

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-medium">Therapist Status</h3>
      <div className="mt-2">
        <span
          className={`inline-block w-3 h-3 rounded-full mr-2 ${
            status === "online"
              ? "bg-green-500"
              : status === "busy"
                ? "bg-yellow-500"
                : status === "vacation"
                  ? "bg-blue-500"
                  : "bg-gray-500"
          }`}
        ></span>
        <span className="capitalize">{status}</span>
      </div>
      {last_online_at && (
        <div className="text-sm text-gray-500 mt-1">
          Last seen: {new Date(last_online_at).toLocaleString()}
        </div>
      )}
    </div>
  );
}
