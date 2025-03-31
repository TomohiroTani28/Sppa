"use client";
// src/app/therapist/bookings/components/BookingCalendar.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Calendar, CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRealtimeBookings } from "@/realtime/useRealtimeBookings";
import { Booking } from "@/types/booking";

interface BookingCalendarProps {
  onBookingUpdate: () => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onBookingUpdate,
}) => {
  const { realtimeBookings, setRealtimeBookings } = useRealtimeBookings();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ブックされた日付を更新する関数
  const updateBookedDates = useCallback(() => {
    if (realtimeBookings && realtimeBookings.length > 0) {
      // Booking型にキャストしてstartTimeにアクセス
      const dates = realtimeBookings.map(
        (booking) => new Date(booking.startTime),
      );
      setBookedDates(dates);
      setLoading(false);
    } else {
      setBookedDates([]);
      setLoading(false);
    }
  }, [realtimeBookings]);

  useEffect(() => {
    updateBookedDates();
    if (!loading) {
      onBookingUpdate();
    }
  }, [realtimeBookings, updateBookedDates, onBookingUpdate, loading]);

  const tileClassName: CalendarProps["tileClassName"] = ({ date, view }) => {
    if (view === "month") {
      const dateString = date.toDateString();
      if (
        bookedDates.some(
          (bookedDate) => bookedDate.toDateString() === dateString,
        )
      ) {
        return "booked-tile";
      }
    }
    return null;
  };

  const onChange: CalendarProps["onChange"] = (date) => {
    if (date instanceof Date) {
      // Date型であることを確認
      setSelectedDate(date);
    } else {
      // 日付範囲が選択された場合の処理 (必要に応じて)
      console.log("Date range selected:", date);
      if (date && Array.isArray(date)) {
        setSelectedDate(date[0]); // 範囲の開始日を選択 (必要に応じて変更)
      }
    }
  };

  if (loading) {
    return <p>Loading calendar...</p>;
  }

  return (
    <div className="booking-calendar">
      <h2>Booking Calendar</h2>
      <Calendar
        onChange={onChange}
        value={selectedDate}
        tileClassName={tileClassName}
        selectRange={false} // selectRange を false に設定 (単一日付選択)
      />
      {selectedDate && <p>選択された日付: {selectedDate.toDateString()}</p>}
    </div>
  );
};

export default BookingCalendar;
