"use client";
// src/app/(therapist)/bookings/components/BookingDetailModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Booking } from "@/types/booking";

interface BookingDetailModalProps {
  bookingId: string;
  onBookingUpdated: () => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  bookingId,
  onBookingUpdated,
}) => {
  // Mock data for Booking - Correctly typed with Booking interface
  const booking: Booking = {
    id: bookingId,
    startTime: new Date(),
    endTime: new Date(),
    status: "pending",
    bookingNotes: "Test Notes",
    guestId: "guest123",
    therapistId: "therapist456",
    serviceId: "service789",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Booking;
  const isLoading = false;
  const error: Error | null = null;
  const updateBooking = (_arg?: any) => Promise.resolve();
  const cancelBooking = () => Promise.resolve();

  if (isLoading) return <div>Loading booking details...</div>;
  if (error) {
    // 型アサーションを使用して error を Error 型にキャストし、message にアクセス
    const errorMessage = (error as Error).message || "不明なエラー";
    return <div>Error loading booking details: {errorMessage}</div>;
  }
  if (!booking) return <div>Booking not found.</div>;

  const handleConfirm = async () => {
    await updateBooking({ status: "confirmed" });
    onBookingUpdated();
    alert("Booking confirmed!");
  };

  const handleCancel = async () => {
    await cancelBooking();
    onBookingUpdated();
    alert("Booking cancelled!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            詳細を確認し、必要に応じて予約を確定またはキャンセルできます。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-right font-semibold">Booking ID</div>
            <div className="col-span-3">{booking.id}</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-right font-semibold">開始時間</div>
            <div className="col-span-3">
              {booking.startTime.toLocaleString()}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-right font-semibold">終了時間</div>
            <div className="col-span-3">{booking.endTime.toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-right font-semibold">ステータス</div>
            <div className="col-span-3">{booking.status}</div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button type="button" onClick={handleConfirm}>
            予約を確定する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;