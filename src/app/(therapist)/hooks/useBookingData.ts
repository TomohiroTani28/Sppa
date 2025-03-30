// src/app/therapist/hooks/useBookingData.ts
import { gql, useQuery } from "@apollo/client";
import { useRealtimeBookings } from "@/app/hooks/realtime/useRealtimeBookings";

// Define the GraphQL query inline
const GET_BOOKINGS = gql`
  query GetBookings($therapistId: ID!) {
    bookings(therapistId: $therapistId) {
      id
      date
      status
      # Add other fields as needed based on your schema
    }
  }
`;

export const useBookingData = (therapistId: string) => {
  const { data, loading, error } = useQuery(GET_BOOKINGS, {
    variables: { therapistId },
  });

  const { realtimeBookings } = useRealtimeBookings(); // 引数なしで呼び出し

  // therapistIdに基づいてフィルタリング
  const filteredRealtimeBookings = realtimeBookings.filter(
    (booking) => booking.therapistId === therapistId,
  );

  return { data, loading, error, realtimeBookings: filteredRealtimeBookings };
};
