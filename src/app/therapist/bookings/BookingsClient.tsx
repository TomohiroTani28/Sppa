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

// 認証状態の型を定義
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

// GraphQL query to fetch bookings with dynamic therapistId
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
  const { getAuthState } = useAuth(); // getAuthState を取得
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { realtimeBookings } = useRealtimeBookings();

  // 認証状態を非同期で取得
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
      skip: !therapistId,
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

  // 認証状態のローディング中
  if (isLoadingAuth) {
    return <div>Loading authentication...</div>;
  }

  // ユーザーが未認証の場合
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