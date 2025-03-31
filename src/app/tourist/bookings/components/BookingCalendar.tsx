// src/app/tourist/bookings/components/BookingCalendar.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRealtimeBookings } from "@/realtime/useRealtimeBookings";
import Badge from "@/components/ui/Badge";
import { formatDate, formatTime } from "@/lib/date-utils";

// react-calendar の型定義に合わせるため、レンジ選択の場合は要素が Date | null となり得る
type CalendarValue = Date | [Date | null, Date | null] | null;

const BookingCalendar = () => {
  const { t } = useTranslation("bookings");
  // 初期値は new Date() で常に有効な日付を保持
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { realtimeBookings } = useRealtimeBookings();

  // 指定日の予約をフィルタリング
  const eventsForDate = selectedDate
    ? realtimeBookings.filter((booking) => {
        const bookingDate = new Date(booking.startTime);
        return bookingDate.toDateString() === selectedDate.toDateString();
      })
    : [];

  // 指定日付に予約があるかどうかのヘルパー
  const hasBookings = (date: Date) => {
    return realtimeBookings.some((booking) => {
      const bookingDate = new Date(booking.startTime);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  // カレンダーのタイルに予約がある場合、バッジを表示
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month" && hasBookings(date)) {
      return (
        <Badge
          variant="secondary"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        >
          {t("bookings_available")}
        </Badge>
      );
    }
    return null;
  };

  // onChange のシグネチャに合わせたコールバック
  const handleDateChange = (
    value: CalendarValue,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (value === null) return;
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value)) {
      // 配列の場合、最初の null でない日付を選択
      const firstValidDate = value.find((d): d is Date => d !== null);
      if (firstValidDate) {
        setSelectedDate(firstValidDate);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
          className="w-full custom-calendar"
        />
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">
          {t("bookings_on", { date: selectedDate ? formatDate(selectedDate) : "" })}
        </h3>

        {eventsForDate.length > 0 ? (
          <div className="space-y-3">
            {eventsForDate.map((booking) => (
              <div
                key={booking.id}
                className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium text-primary">
                    {booking.therapistId || t("unknown_therapist")}
                  </h4>
                  <p className="text-gray-600">{formatTime(booking.startTime)}</p>
                </div>
                <Badge variant="outline">{booking.status}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">{t("no_bookings_this_date")}</p>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;
