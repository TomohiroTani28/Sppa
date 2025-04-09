// src/app/therapist/bookings/BookingsClient.tsx
"use client";
export const dynamic = "force-dynamic";

import BookingCalendar from "@/app/therapist/bookings/components/BookingCalendar";
import BookingList from "@/app/therapist/bookings/components/BookingList";
import { useAuth } from "@/hooks/api/useAuth";
import RealtimeBookingList from "@/realtime/RealtimeBookingList";
import { useRealtimeBookings } from "@/realtime/useRealtimeBookings";
import type { AuthState } from "@/types/auth";
import { Booking } from "@/types/booking";
import { gql, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";

const FETCH_BOOKINGS_QUERY = gql`
  query FetchTherapistBookings($therapistId: uuid!) {
    bookings(where: { therapist_id: { _eq: $therapistId } }) {
      id
      start_time
      end_time
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

  // 認証状態を取得
  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const state = await getAuthState();
        setAuthState(state);
      } catch (err) {
        console.error("Failed to fetch auth state:", err);
        setAuthState(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    fetchAuth();
  }, [getAuthState]);

  const therapistId = authState?.user?.id;

  // GraphQL で予約データを取得
  const {
    loading: isLoadingBookings,
    error: bookingsError,
    data,
    refetch,
  } = useQuery<{ bookings: Booking[] }, { therapistId: string }>(
    FETCH_BOOKINGS_QUERY,
    {
      skip: !therapistId,
      variables: { therapistId: therapistId ?? "" },
    }
  );

  // GraphQLから取得したデータをステートにセット
  const updateBookings = useCallback(() => {
    if (data?.bookings) {
      setBookings(data.bookings);
    }
  }, [data]);

  useEffect(() => {
    updateBookings();
  }, [updateBookings]);

  // カレンダーや予約更新で再取得
  const handleBookingUpdate = useCallback(() => {
    refetch();
    updateBookings();
  }, [refetch, updateBookings]);

  // SSR対策：クライアントだけで表示
  if (typeof window === "undefined") return null;

  if (isLoadingAuth) return <div>Loading authentication...</div>;

  if (!authState?.user) return <div>Please log in to view bookings.</div>;

  if (isLoadingBookings) return <div>Loading bookings...</div>;

  if (bookingsError)
    return <div>Error loading bookings: {bookingsError.message}</div>;

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