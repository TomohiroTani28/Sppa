// src/app/tourist/bookings/components/BookingDetailModal.tsx

import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useQuery, useSubscription, gql } from "@apollo/client";
import { useRealtimeBookings } from "@/realtime/useRealtimeBookings";
import { useUser } from "@/hooks/api/useUser";

/**
 * Booking 型の定義（GraphQL のエイリアスに合わせた形）
 */
export interface Booking {
  id: string;
  guestId: string;
  therapistId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: string;
  bookingNotes?: string;
  confirmedAt?: string;
  canceledAt?: string;
  completedAt?: string;
  therapistProfiles?: {
    user: { name: string };
    businessName?: string;
  } | null;
  therapistServices?: {
    serviceName: string;
    price: number;
    currency: string;
  } | null;
}

// GraphQL Queries and Subscriptions
const GET_BOOKING_DETAILS = gql`
  query GetBookingDetails($id: UUID!) {
    bookings_by_pk(id: $id) {
      id
      guestId: guest_id
      therapistId: therapist_id
      serviceId: service_id
      startTime: start_time
      endTime: end_time
      status
      bookingNotes: booking_notes
      confirmedAt: confirmed_at
      canceledAt: canceled_at
      completedAt: completed_at
      therapistProfiles: therapist_profiles {
        user {
          name
        }
        businessName: business_name
      }
      therapistServices: therapist_services {
        serviceName: service_name
        price
        currency
      }
    }
  }
`;

const BOOKING_SUBSCRIPTION = gql`
  subscription OnBookingUpdate($id: UUID!) {
    bookings_by_pk(id: $id) {
      id
      status
      confirmedAt: confirmed_at
      canceledAt: canceled_at
      completedAt: completed_at
    }
  }
`;

/**
 * Props for the BookingDetailModal component
 */
interface BookingDetailModalProps {
  readonly bookingId: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

/**
 * BookingDetailModal displays detailed information about a tourist's booking.
 * Includes real-time updates, error handling, and i18n support.
 */
export function BookingDetailModal({ bookingId, isOpen, onClose }: BookingDetailModalProps) {
  const { t } = useTranslation("bookings");
  const [booking, setBooking] = useState<Booking | null>(null);
  // useUser が userId 引数を必須としているため、空文字列を渡してエラーを回避
  const { user, loading: userLoading, error: userError } = useUser("");

  // Fetch initial booking details
  const { data, loading, error } = useQuery<{ bookings_by_pk: Booking }>(GET_BOOKING_DETAILS, {
    variables: { id: bookingId },
    skip: !isOpen || !bookingId,
  });

  // Real-time subscription for booking updates
  const { data: subData } = useSubscription<{ bookings_by_pk: Booking }>(BOOKING_SUBSCRIPTION, {
    variables: { id: bookingId },
    skip: !isOpen || !bookingId,
  });

  // カスタムフックは引数なしで呼び出す（※定義側の仕様に合わせる）
  useRealtimeBookings();

  // Update booking state when data is fetched or updated
  useEffect(() => {
    if (data?.bookings_by_pk) {
      setBooking(data.bookings_by_pk);
    }
  }, [data]);

  useEffect(() => {
    if (subData?.bookings_by_pk) {
      setBooking((prev) =>
        prev ? { ...prev, ...subData.bookings_by_pk } : subData.bookings_by_pk
      );
    }
  }, [subData]);

  // Handle loading and error states
  if (loading || userLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || userError || !booking) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>{t("error.title")}</DialogTitle>
          </DialogHeader>
          <p className="text-red-500">
            {error?.message ?? userError ?? t("error.message")}
          </p>
          <Button variant="outline" onClick={onClose} className="mt-4">
            {t("common:close")}
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  // Status badge color logic
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "canceled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {t("detail.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Therapist Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-700">{t("detail.therapist")}</h3>
            <p className="text-gray-900">
              {booking.therapistProfiles?.businessName ?? booking.therapistProfiles?.user.name}
            </p>
          </div>

          {/* Service Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-700">{t("detail.service")}</h3>
            <p className="text-gray-900">
              {booking.therapistServices?.serviceName ?? t("detail.no-service")}
            </p>
            <p className="text-sm text-gray-500">
              {booking.therapistServices?.price
                ? `${booking.therapistServices.price} ${booking.therapistServices.currency}`
                : ""}
            </p>
          </div>

          {/* Date and Time */}
          <div>
            <h3 className="text-sm font-medium text-gray-700">{t("detail.time")}</h3>
            <p className="text-gray-900">
              {format(new Date(booking.startTime), "PPPp")} -{" "}
              {format(new Date(booking.endTime), "p")}
            </p>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-700">{t("detail.status")}</h3>
            <Badge className={cn("text-white", getStatusColor(booking.status))}>
              {t(`status.${booking.status}`)}
            </Badge>
          </div>

          {/* Notes */}
          {booking.bookingNotes && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">{t("detail.notes")}</h3>
              <p className="text-gray-900">{booking.bookingNotes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          {booking.status === "pending" && user?.role === "tourist" && (
            <Button
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-50"
              onClick={() => {
                // TODO: Implement cancel booking mutation
                console.log("Cancel booking:", bookingId);
              }}
            >
              {t("detail.cancel")}
            </Button>
          )}
          <Button variant="default" onClick={onClose} className="bg-[#007aff] text-white">
            {t("common:close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
