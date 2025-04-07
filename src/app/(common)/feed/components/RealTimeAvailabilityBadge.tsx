// src/app/(common)/feed/components/RealTimeAvailabilityBadge.tsx
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useTranslation } from 'next-i18next';
import React from "react";

interface RealTimeAvailabilityBadgeProps {
  isAvailable: boolean;
  className?: string;
}

export const RealTimeAvailabilityBadge: React.FC<RealTimeAvailabilityBadgeProps> = ({
  isAvailable,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Badge
      variant={isAvailable ? "default" : "destructive"}
      className={cn(
        "px-2 py-1 text-xs font-medium rounded-full",
        isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
        className
      )}
    >
      {isAvailable ? t('therapist.available') : t('therapist.unavailable')}
    </Badge>
  );
};