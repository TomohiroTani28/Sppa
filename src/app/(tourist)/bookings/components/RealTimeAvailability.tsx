// src/app/tourist/bookings/components/RealTimeAvailability.tsx
"use client";
import { useTranslation } from "react-i18next";
import { useTherapistAvailabilityApi } from "@/hooks/api/useTherapistAvailabilityApi";
import Badge from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { formatTime } from "@/lib/date-utils";
import { useState, useEffect } from "react";
import { TherapistAvailabilitySlot } from "@/types/availability";

interface RealTimeAvailabilityProps {
  therapistId: string;
}

const RealTimeAvailability = ({ therapistId }: RealTimeAvailabilityProps) => {
  const { t } = useTranslation("bookings");
  const { fetchAvailability, subscribeToAvailability } = useTherapistAvailabilityApi(therapistId);

  // 状態の定義
  const [availabilitySlots, setAvailabilitySlots] = useState<TherapistAvailabilitySlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 初回フェッチとリアルタイム更新
  useEffect(() => {
    // 初回データ取得
    const loadAvailability = async () => {
      try {
        setLoading(true);
        const response = await fetchAvailability();
        setAvailabilitySlots(response.available_slots);
        setLoading(false);
      } catch (err) {
        setError(t("error_loading_availability"));
        setLoading(false);
      }
    };

    loadAvailability();

    // リアルタイム更新のサブスクリプション
    const unsubscribe = subscribeToAvailability((slots: TherapistAvailabilitySlot[]) => {
      setAvailabilitySlots(slots);
    });

    // クリーンアップ
    return () => unsubscribe();
  }, [fetchAvailability, subscribeToAvailability, t]);

  if (loading) {
    return <p>{t("loading_availability")}</p>;
  }

  if (error) {
    return <p className="text-center text-gray-500">{error}</p>;
  }

  if (!availabilitySlots.length) {
    return <p className="text-center text-gray-500">{t("no_therapists_available")}</p>;
  }

  return (
    <div className="space-y-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Therapist</CardTitle>
          <Badge variant={availabilitySlots.length > 0 ? "success" : "secondary"}>
            {t(`therapist_status_${availabilitySlots.length > 0 ? "online" : "offline"}`)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("available_today")}</span>
              <div className="space-x-2">
                {availabilitySlots.map((slot) => (
                  <Badge key={slot.id} variant="outline">
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAvailability;