// src/components/ServiceDetails.tsx
import React from 'react';
import { useQuery, useSubscription, gql } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useTranslation } from 'next-i18next';
import { TherapistProfile, WorkingHour } from '@/types/therapist';
import { Service } from '@/types/service';

const GET_SERVICE_DETAILS = gql`
  query GetServiceDetails($id: UUID!) {
    therapist_services_by_pk(id: $id) {
      id
      name
      description
      price
      duration
      therapist_profile {
        id
        user_id
        bio
        languages
        working_hours
        status
      }
    }
  }
`;

const SERVICE_AVAILABILITY_SUBSCRIPTION = gql`
  subscription OnServiceAvailability($serviceId: UUID!) {
    therapist_availability(where: { service_id: { _eq: $serviceId } }) {
      id
      start_time
      end_time
      is_available
    }
  }
`;

interface ServiceDetailsProps {
  serviceId: string;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ serviceId }) => {
  const { t } = useTranslation('common');

  const { loading, error, data } = useQuery(GET_SERVICE_DETAILS, {
    variables: { id: serviceId },
  });

  const { data: subscriptionData } = useSubscription(SERVICE_AVAILABILITY_SUBSCRIPTION, {
    variables: { serviceId },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        {t('error.loading')}: {error.message}
      </div>
    );
  }

  const service: Service = data.therapist_services_by_pk;
  const therapist: TherapistProfile = service.therapist_profile;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">{service.description}</p>
        <p>
          {t('service.price')}: <span className="font-semibold">{service.price}</span>
        </p>
        <p>
          {t('service.duration')}: <span className="font-semibold">{service.duration}</span>
        </p>
        {/* 以下省略 */}
        <Button className="w-full mt-4 bg-[#007aff] hover:bg-[#005bb5] text-white">
          {t('service.bookNow')}
        </Button>
      </CardContent>
    </Card>
  );
};