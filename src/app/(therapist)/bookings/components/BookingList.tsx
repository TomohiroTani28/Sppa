"use client";
// src/app/(therapist)/bookings/components/BookingList.tsx
import React from "react";
import { Booking } from "@/types/booking";

interface BookingListProps {
  bookings: Booking[];
}

const BookingList: React.FC<BookingListProps> = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    return <p>予約はありません。</p>;
  }

  return (
    <div className="booking-list">
      <h3>予約リスト</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            {/* 予約の詳細を表示 (必要に応じて調整) */}
            <p>予約ID: {booking.id}</p>
            <p>開始時間: {new Date(booking.startTime).toLocaleString()}</p>{" "}
            {/* start_time を startTime に修正 */}
            <p>ステータス: {booking.status}</p>
            {/* ... その他の予約情報 ... */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;
