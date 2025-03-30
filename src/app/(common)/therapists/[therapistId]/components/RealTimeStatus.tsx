// src/app/(common)/therapists/[therapistId]/components/RealTimeStatus.tsx
import React from 'react';
import Badge from '@/components/ui/Badge';
import { useSubscription, gql } from '@apollo/client';
import { useParams } from 'next/navigation';
import { TherapistProfile } from '@/types/therapist';
import { useTranslation } from 'next-i18next';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const GET_THERAPIST_STATUS_SUBSCRIPTION = gql`
  subscription OnTherapistStatus($therapistId: UUID!) {
    therapist_profiles(where: { id: { _eq: $therapistId } }) {
      status
    }
  }
`;

interface RealTimeStatusProps {
  className?: string;
}

const statusMap: { [key: string]: { labelKey: string; className: string } } = {
  online: { labelKey: 'therapist.status.online', className: 'bg-green-500 text-white' },
  offline: { labelKey: 'therapist.status.offline', className: 'bg-gray-400 text-white' },
  busy: { labelKey: 'therapist.status.busy', className: 'bg-yellow-500 text-white' },
  vacation: { labelKey: 'therapist.status.vacation', className: 'bg-blue-500 text-white' },
};

const RealTimeStatus: React.FC<RealTimeStatusProps> = ({ className }) => {
  const { therapistId } = useParams();
  const { t } = useTranslation('common'); // 'common' はネームスペースに合わせてください

  const { data, loading, error } = useSubscription(GET_THERAPIST_STATUS_SUBSCRIPTION, {
    variables: { therapistId },
  });

  if (loading) {
    return <LoadingSpinner />; // size プロパティを削除
  }

  if (error) {
    console.error('Error fetching therapist status:', error);
    return <Badge className={`bg-red-500 text-white ${className}`}>{t('therapist.status.error')}</Badge>;
  }

  const therapistStatus = data?.therapist_profiles?.[0]?.status as TherapistProfile['status'] | undefined;

  if (!therapistStatus) {
    return <Badge className={`bg-gray-400 text-white ${className}`}>{t('therapist.status.unknown')}</Badge>;
  }

  const statusInfo = statusMap[therapistStatus];

  return (
    <Badge className={`${statusInfo?.className || 'bg-gray-400 text-white'} ${className}`}>
      {t(statusInfo?.labelKey || 'therapist.status.unknown')}
    </Badge>
  );
};

export default RealTimeStatus;