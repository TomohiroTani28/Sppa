// src/app/tourist/bookings/components/BookingCard.tsx
"use client";

import React from "react";

export type BookingStatus = "pending" | "confirmed" | "canceled" | "completed";

export interface Booking {
  id: string;
  therapistName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
}

interface BookingCardProps {
  booking: Booking;
  onClick?: (id: string) => void;
}

const getStatusClasses = (status: BookingStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-200 text-yellow-800";
    case "confirmed":
      return "bg-green-200 text-green-800";
    case "canceled":
      return "bg-red-200 text-red-800";
    case "completed":
      return "bg-blue-200 text-blue-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const getStatusLabel = (status: BookingStatus) => {
  switch (status) {
    case "pending":
      return "保留中";
    case "confirmed":
      return "確定済み";
    case "canceled":
      return "キャンセル";
    case "completed":
      return "完了";
    default:
      return "";
  }
};

const BookingCard: React.FC<BookingCardProps> = ({ booking, onClick }) => {
  return (
    <div
      className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-200 cursor-pointer"
      onClick={() => onClick && onClick(booking.id)}
    >
      <h3 className="text-lg font-semibold">{booking.serviceName}</h3>
      <p className="text-sm text-gray-600">
        セラピスト: {booking.therapistName}
      </p>
      <p className="text-sm text-gray-600">
        開始: {new Date(booking.startTime).toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">
        終了: {new Date(booking.endTime).toLocaleString()}
      </p>
      <p
        className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${getStatusClasses(
          booking.status,
        )}`}
      >
        {getStatusLabel(booking.status)}
      </p>
    </div>
  );
};

export default BookingCard;
