"use client";
// src/app/(therapist)/bookings/page.tsx
import { useRealtimeBookings } from "@/app/hooks/realtime/useRealtimeBookings";
import BookingCalendar from "@/app/therapist/bookings/components/BookingCalendar";
import BookingList from "@/app/therapist/bookings/components/BookingList";
import RealtimeBookingList from "@/realtime/RealtimeBookingList";
import { Booking } from "@/types/booking";
import { gql, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";

// GraphQL query to fetch bookings
const FETCH_BOOKINGS_QUERY = gql`
  query FetchTherapistBookings {
    bookings(where: { therapist_id: { _eq: "YOUR_THERAPIST_ID" } }) {
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

const BookingsPage: React.FC = () => {
  const therapistId = "YOUR_THERAPIST_ID"; // セラピストIDを動的に取得するように修正が必要
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { realtimeBookings } = useRealtimeBookings();
  const { loading, error, data, refetch } = useQuery<
    { bookings: Booking[] },
    { therapistId: string }
  >(FETCH_BOOKINGS_QUERY, {
    variables: { therapistId },
  });

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

export default BookingsPage;
