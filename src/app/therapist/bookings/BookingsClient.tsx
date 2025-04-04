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
  const { user, loading: authLoading } = useAuth();
  const therapistId = user?.id;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const { realtimeBookings } = useRealtimeBookings();

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

  if (authLoading || loading) return <div>Loading bookings...</div>;
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