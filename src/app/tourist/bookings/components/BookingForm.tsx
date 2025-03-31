// src/app/tourist/bookings/components/BookingForm.tsx
"use client";

import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useCreateBooking } from "@/app/hooks/api/useCreateBooking";
import { useFetchTherapists } from "@/app/hooks/api/useFetchTherapists";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import DatePicker from "@/app/components/ui/DatePicker";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/Form";

// Validation schema
const BookingFormSchema = z.object({
  therapistId: z.string().uuid("Please select a therapist"),
  date: z.date({ required_error: "Booking date is required" }),
  time: z
    .string()
    .regex(/^([0-1]?\d|2[0-3]):[0-5]\d$/, "Invalid time format"),
  serviceId: z.string().uuid("Please select a service").optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

type BookingFormValues = z.infer<typeof BookingFormSchema>;

const BookingForm = () => {
  const { t } = useTranslation("bookings");
  // Initial filter conditions can be adjusted as needed
  const { therapists, loading: therapistsLoading } = useFetchTherapists({}); // Updated destructuring
  const { createBooking, loading: bookingLoading } = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      therapistId: "",
      date: new Date(),
      time: "",
      notes: "",
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    // Guest ID should be fetched from auth (example placeholder)
    const guestId = "CURRENT_GUEST_ID"; // Replace with actual auth logic

    // Create startTime from date and time
    const startTime = new Date(data.date);
    const [hours, minutes] = data.time.split(":");
    startTime.setHours(parseInt(hours, 10));
    startTime.setMinutes(parseInt(minutes, 10));

    // Example: Set endTime 1 hour later (adjust as needed)
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);

    createBooking(
      guestId,
      data.therapistId,
      startTime.toISOString(),
      endTime.toISOString(),
    )
      .then(() => {
        form.reset();
      })
      .catch((error) => {
        console.error("Booking creation failed", error);
      });
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        control={form.control}
        name="therapistId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("select_therapist")}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("choose_therapist")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {therapistsLoading ? (
                  <p>{t("loading_therapists")}</p>
                ) : (
                  therapists?.map((therapist) => (
                    <SelectItem key={therapist.id} value={therapist.id}>
                      {therapist.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <Controller
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("select_date")}</FormLabel>
            <FormControl>
              <DatePicker value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Controller
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("select_time")}</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Controller
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("additional_notes")}</FormLabel>
            <FormControl>
              <Input placeholder={t("notes_placeholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" disabled={bookingLoading} className="w-full">
        {bookingLoading ? t("booking_in_progress") : t("create_booking")}
      </Button>
    </Form>
  );
};

export default BookingForm;