"use client";
// src/app/(common)/therapists/[therapistId]/components/BookingButton.tsx
import { PriceDisplay } from "@/components/PriceDisplay";
import { TherapistAvailabilityStatus } from "@/components/TherapistAvailabilityStatus";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { useCreateBooking } from "@/hooks/api/useCreateBooking";
import { useErrorLogApi } from "@/hooks/api/useErrorLogApi";
import { useRealtimeAvailability } from "@/realtime/useRealtimeAvailability";
import {
  Select as RadixSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { addHours, format } from "date-fns";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TherapistAvailability {
  id: string;
  therapist_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface CreateBookingResponse {
  createBooking: string;
}

interface BookingButtonProps {
  therapistId: string;
  serviceId?: string;
  serviceName?: string;
  price?: number;
  currency?: string;
  duration?: number;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
}

const useTimeSlots = (
  selectedDate: Date | undefined,
  availability: TherapistAvailability[]
) => {
  if (!selectedDate || !availability.length) return [];

  const today = new Date();
  const isToday = selectedDate.toDateString() === today.toDateString();
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const slots: string[] = [];

  const dayAvailability = availability.filter(
    (slot) =>
      format(new Date(slot.start_time), "yyyy-MM-dd") === selectedDateStr &&
      slot.is_available
  );

  dayAvailability.forEach((slot) => {
    let currentSlot = new Date(slot.start_time);
    const endTime = new Date(slot.end_time);

    if (isToday) {
      const nextHour = new Date(today.setHours(today.getHours() + 1, 0, 0, 0));
      currentSlot = currentSlot < nextHour ? nextHour : currentSlot;
    }

    while (addHours(currentSlot, 1) <= endTime) {
      slots.push(format(currentSlot, "HH:mm"));
      currentSlot = addHours(currentSlot, 1);
    }
  });

  return Array.from(new Set(slots)).sort(
    (a, b) => parseInt(a.replace(":", "")) - parseInt(b.replace(":", ""))
  );
};

export const BookingButton: React.FC<BookingButtonProps> = ({
  therapistId,
  serviceId,
  serviceName,
  price,
  currency,
  duration = 60,
  className,
  variant = "default",
  size = "default",
  disabled = false,
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const { createBooking, loading: isLoading, error } = useCreateBooking();
  const { createErrorLog } = useErrorLogApi();
  const { lastOnlineMap } = useRealtimeAvailability([therapistId]);

  const therapistStatus = lastOnlineMap[therapistId] ? "online" : "offline";

  const [availability, setAvailability] = useState<TherapistAvailability[]>([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      const mockAvailability: TherapistAvailability[] = [
        {
          id: "1",
          therapist_id: therapistId,
          start_time: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
          end_time: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
          is_available: true,
        },
      ];
      setAvailability(mockAvailability);
    };
    fetchAvailability();
  }, [therapistId]);

  const timeSlots = useTimeSlots(selectedDate, availability);

  const handleBook = async () => {
    const isFormIncomplete = !selectedDate || !selectedTime || !serviceId;
    if (isFormIncomplete) return;

    try {
      const timeComponents = selectedTime.split(":");
      const hours = Number(timeComponents[0] || 0);
      const minutes = Number(timeComponents[1] || 0);
      
      const startTime = new Date(selectedDate);
      startTime.setHours(hours, minutes, 0, 0);
      const endTime = addHours(startTime, duration / 60);

      const result = await createBooking(
        therapistId,
        serviceId,
        startTime.toISOString(),
        endTime.toISOString()
      );

      if ((result as any).data?.createBooking) {
        setOpen(false);
        router.push(
          `/tourist/bookings?success=true&bookingId=${(result as any).data.createBooking}`
        );
      }
    } catch (err) {
      createErrorLog({
        error_type: "BOOKING_ERROR",
        message: `Failed to create booking: ${
          err instanceof Error ? err.message : String(err)
        }`,
        stack_trace: err instanceof Error && err.stack ? err.stack : "",
      });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setNotes("");
    }
  };

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && date >= minDate) {
      setSelectedDate(date);
    }
  };

  const showPrice = price != null && currency != null;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={disabled || therapistStatus !== "online"}
        onClick={() => setOpen(true)}
      >
        {t("book_now")}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("book_appointment")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{serviceName}</p>
                <p className="text-sm text-gray-500">
                  {duration} {t("minutes")}
                </p>
              </div>
              {showPrice && (
                <PriceDisplay amount={price ?? 0} currency={currency ?? "USD"} />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("therapist_availability")}
              </label>
              <TherapistAvailabilityStatus therapistId={therapistId} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("select_date")}</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </div>

            {selectedDate && (
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("select_time")}</label>
                {timeSlots.length > 0 ? (
                  <RadixSelect
                    value={selectedTime ?? ""}
                    onValueChange={(val: string) => setSelectedTime(val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("choose_time")} />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </RadixSelect>
                ) : (
                  <p className="text-sm text-red-500">
                    {t("no_available_slots")}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                {t("notes")}
              </label>
              <textarea
                id="notes"
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("special_requests")}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {error.message ?? t("booking_error")}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleBook}
              disabled={isLoading || !selectedDate || !selectedTime}
            >
              {isLoading ? t("booking") : t("confirm_booking")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingButton;
