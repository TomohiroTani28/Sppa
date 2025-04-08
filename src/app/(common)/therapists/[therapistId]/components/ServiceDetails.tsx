"use client";
// src/app/(common)/therapists/[therapistId]/components/ServiceDetails.tsx
import { MediaGallery } from '@/components/MediaGallery';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Spinner } from '@/components/ui/Spinner';
import { GET_SERVICE_DETAIL as GET_SERVICE_DETAILS, SUBSCRIBE_TO_THERAPIST_SERVICES as SUBSCRIBE_SERVICE_UPDATES } from '@/lib/queries/service';
import { formatCurrency } from '@/lib/utils';
import { Media } from '@/types/media';
import { useQuery, useSubscription } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ServiceDetailsProps {
  serviceId: string;
}

interface Service {
  id: string;
  service_name: string;
  description?: string;
  duration: number;
  price: number;
  currency: string;
  category?: string;
  is_active: boolean;
  media: Array<{
    media_id: string;
    media: Media;
  }>;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ serviceId }) => {
  const { t } = useTranslation();

  const { loading, error, data } = useQuery<{ therapist_services_by_pk: Service }>(GET_SERVICE_DETAILS, {
    variables: { id: serviceId },
  });

  const { data: subscriptionData } = useSubscription<{ therapist_services_by_pk: Service }>(
    SUBSCRIBE_SERVICE_UPDATES,
    {
      variables: { id: serviceId },
    }
  );

  const service = subscriptionData?.therapist_services_by_pk || data?.therapist_services_by_pk;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      );
    }

    if (error) {
      return <ErrorMessage message={t('error.fetch_service_failed', { message: error.message })} />;
    }

    if (!service) {
      return <p className="text-center text-gray-500">{t('service_not_found')}</p>;
    }

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{service.service_name}</CardTitle>
          {service.category && (
            <Badge variant="secondary" className="mt-2">
              {service.category}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {service.description && <p className="text-gray-700">{service.description}</p>}
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold">{t('price')}:</span>{' '}
              {formatCurrency(service.price, { currency: service.currency })}
            </p>
            <p className="text-lg">
              <span className="font-semibold">{t('duration')}:</span>{' '}
              {service.duration} {t('minutes')}
            </p>
          </div>
          {service.media.length > 0 && (
            <div className="mt-4">
              <MediaGallery media={service.media.map(item => item.media)} />
            </div>
          )}
          <Button
            variant="default"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-4"
            disabled={!service.is_active}
            asChild
          >
            <a href={`/tourist/bookings/new?serviceId=${serviceId}`}>{t('book_now')}</a>
          </Button>
        </CardContent>
      </Card>
    );
  };

  return renderContent();
};

export default ServiceDetails;