// src/app/(common)/home/components/RealTimeAvailabilityBadge.tsx
import Badge from '@/app/components/ui/Badge';
import { useTranslation } from 'next-i18next';

interface RealTimeAvailabilityBadgeProps {
  readonly isAvailable: boolean;
}

export default function RealTimeAvailabilityBadge({ isAvailable }: RealTimeAvailabilityBadgeProps) {
  const { t } = useTranslation();

  return (
    <Badge variant={isAvailable ? 'default' : 'outline'}>
      {isAvailable ? t('therapist.available') : t('therapist.unavailable')}
    </Badge>
  );
}