// src/app/(common)/feed/components/InstantBookingButton.tsx
"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";

interface InstantBookingButtonProps {
  therapistId: string;
  isAvailable: boolean;
}

export default function InstantBookingButton({ therapistId, isAvailable }: InstantBookingButtonProps) {
  const { t } = useTranslation("common");
  const router = useRouter();

  const handleBooking = () => {
    // 予約詳細ページへ遷移。isAvailableがfalseの場合は別途処理（例：トースト表示）を検討
    if (isAvailable) {
      router.push(`/therapists/${therapistId}/booking`);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleBooking}
      disabled={!isAvailable}
      aria-label={isAvailable ? t("bookNow") : t("unavailable")}
    >
      {t(isAvailable ? "bookNow" : "unavailable")}
    </Button>
  );
}
