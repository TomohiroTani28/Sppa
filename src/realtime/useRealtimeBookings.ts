// src/realtime/useRealtimeBookings.ts
import { gql, useSubscription } from "@apollo/client";
import { useState, useEffect } from "react";
import { Booking } from "@/types/booking";

export const GET_REALTIME_BOOKINGS = gql`
  subscription GetRealtimeBookings {
    bookings(where: { guest_id: { _eq: "X-Hasura-User-Id" } }) {
      id
      guest_id
      therapist_id
      start_time
      end_time
      status
      created_at
      updated_at
      booking_notes
      therapist {
        id
        name
      }
    }
  }
`;

export const useRealtimeBookings = () => {
  const [realtimeBookings, setRealtimeBookings] = useState<Booking[]>([]);

  const { data, loading, error } = useSubscription(GET_REALTIME_BOOKINGS);

  useEffect(() => {
    if (data?.bookings) {
      setRealtimeBookings(data.bookings);
    }
  }, [data]);

  return { realtimeBookings, setRealtimeBookings, loading, error };
};