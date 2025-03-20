"use client";
// src/app/realtime/RealtimeBookingList.tsx
import React from "react";
import { Booking } from "@/types/booking"; // Booking型定義をインポート (パスは適宜修正)

interface RealtimeBookingListProps {
  realtimeBookings: Booking[];
}

const RealtimeBookingList: React.FC<RealtimeBookingListProps> = ({
  realtimeBookings,
}) => {
  if (!realtimeBookings) {
    return <p>リアルタイム予約はありません。</p>;
  }

  return (
    <div className="realtime-booking-list">
      <h3>Realtime Bookings</h3>
      <ul>
        {realtimeBookings.map((booking) => (
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

export default RealtimeBookingList;
