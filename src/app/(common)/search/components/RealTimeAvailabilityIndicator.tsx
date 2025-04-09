// src/app/(common)/search/components/RealTimeAvailabilityIndicator.tsx
import { Badge } from '@/components/ui/Badge'; // ✅ 修正済み
import { useRealtimeAvailability } from '@/hooks/api/useRealtimeAvailability';
import { useEffect } from 'react';

interface RealTimeAvailabilityIndicatorProps {
  readonly therapistId: string;
}

export default function RealTimeAvailabilityIndicator({ therapistId }: RealTimeAvailabilityIndicatorProps) {
  // ✅ therapistId を引数に渡すよう修正
  const { availabilityMap, subscribeToAvailability } = useRealtimeAvailability([therapistId]);

  useEffect(() => {
    subscribeToAvailability(therapistId);
  }, [therapistId, subscribeToAvailability]);

  const availability = availabilityMap[therapistId];
  const badgeVariant = availability ? 'success' : 'default';

  return (
    <Badge variant={badgeVariant} className="capitalize">
      {availability ? 'Available' : 'Unavailable'}
    </Badge>
  );
}
