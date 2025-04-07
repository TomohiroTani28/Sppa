// src/app/therapist/bookings/BookingsClient.tsx
"use client";
export const dynamic = "force-dynamic";

import { useRealtimeBookings } from "@/realtime/useRealtimeBookings";
import BookingCalendar from "@/app/therapist/bookings/components/BookingCalendar";
import BookingList from "@/app/therapist/bookings/components/BookingList";
import RealtimeBookingList from "@/realtime/RealtimeBookingList";
import { Booking } from "@/types/booking";
import { gql, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/api/useAuth";

interface AuthState {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

const FETCH_BOOKINGS_QUERY = gql`
  query FetchTherapistBookings($therapistId: uuid!) {
    bookings(where: { therapist_id: { _eq: $therapistId } }) {
      id
      startTime
      endTime
      status
      booking_notes
      guest {
        id
        name
        profile_picture
      }
      service {
        id
        service_name
        duration
        price
        currency
      }
    }
  }
`;

const BookingsClient: React.FC = () => {
  const { getAuthState } = useAuth();
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { realtimeBookings } = useRealtimeBookings();

  // Fetch auth state only on the client side
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const state = await getAuthState();
        setAuthState(state);
      } catch (error) {
        console.error("Failed to fetch auth state:", error);
        setAuthState(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    fetchAuthState();
  }, [getAuthState]);

  const therapistId = authState?.user?.id;

  const {
    loading,
    error,
    data,
    refetch,
  } = useQuery<{ bookings: Booking[] }, { therapistId: string }>(
    FETCH_BOOKINGS_QUERY,
    {
      skip: !therapistId, // Skip query until therapistId is available
      variables: { therapistId: therapistId ?? "" },
    }
  );

  const updateBookings = useCallback(() => {
    if (data?.bookings) {
      setBookings(data.bookings);
    }
  }, [data]);

  useEffect(() => {
    updateBookings();
  }, [updateBookings]);

  const handleBookingUpdate = useCallback(() => {
    refetch();
    updateBookings();
  }, [refetch, updateBookings]);

  // Render nothing until the component is mounted on the client
  if (typeof window === "undefined") {
    return null; // Prevent server-side rendering
  }

  if (isLoadingAuth) {
    return <div>Loading authentication...</div>;
  }

  if (!authState?.user) {
    return <div>Please log in to view bookings.</div>;
  }

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error loading bookings: {error.message}</div>;

  return (
    <div className="booking-page">
      <h1>Your Bookings</h1>
      <BookingCalendar onBookingUpdate={handleBookingUpdate} />
      <RealtimeBookingList realtimeBookings={realtimeBookings} />
      <BookingList bookings={bookings} />
    </div>
  );
};

export default BookingsClient;