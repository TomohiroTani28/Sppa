// src/app/(tourist)/bookings/page.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import TouristLayout from "../components/TouristLayout";
import BookingList from "./components/BookingList";
import BookingForm from "./components/BookingForm";
import BookingCalendar from "./components/BookingCalendar";
import RealTimeAvailability from "./components/RealTimeAvailability";
import CancelPolicy from "./components/CancelPolicy";
import ReminderNotification from "./components/ReminderNotification";
import AddOption from "./components/AddOption";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import BottomNavigation from "@/app/components/common/BottomNavigation";

const BookingsPage = () => {
  const { t } = useTranslation("bookings");
  const [showBookingForm, setShowBookingForm] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* メインコンテンツ */}
      <main className="flex-1 px-4 py-6 space-y-6">
        {/* リアルタイムのセラピスト状況 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("real_time_availability")}</CardTitle>
          </CardHeader>
          <CardContent>
          <RealTimeAvailability therapistId="some-id" />
          </CardContent>
        </Card>

        {/* 予約カレンダー */}
        <Card>
          <CardHeader>
            <CardTitle>{t("booking_calendar")}</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingCalendar />
          </CardContent>
        </Card>

        {/* 予約フォームの表示切り替え */}
        <div className="flex justify-center">
          <Button
            onClick={() => setShowBookingForm(!showBookingForm)}
            variant={showBookingForm ? "outline" : "default"}
          >
            {showBookingForm ? t("hide_booking_form") : t("show_booking_form")}
          </Button>
        </div>

        {/* 予約フォーム */}
        {showBookingForm && (
          <Card>
            <CardHeader>
              <CardTitle>{t("new_booking")}</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingForm />
              <CancelPolicy />
              <AddOption />
            </CardContent>
          </Card>
        )}

        {/* 予約のリマインダー */}
        <Card>
          <CardHeader>
            <CardTitle>{t("booking_reminders")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ReminderNotification />
          </CardContent>
        </Card>

        {/* 予約リスト */}
        <Card>
          <CardHeader>
            <CardTitle>{t("your_bookings")}</CardTitle>
          </CardHeader>
          <CardContent>
           <BookingList guestId="some-id" />
          </CardContent>
        </Card>
      </main>

      {/* フッター (BottomNavigation) */}
      <BottomNavigation userType="tourist" />
    </div>
  );
};

export default BookingsPage;
