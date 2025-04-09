// src/app/(common)/search/components/TherapistCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Therapist } from '@/types/therapist';
import { Card } from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { TherapistAvailabilityStatus } from '@/components/TherapistAvailabilityStatus';

// Component for displaying language badges
const LanguageBadges: React.FC<{
  languages: string[],
  preferredLanguages: string[]
}> = ({ languages, preferredLanguages }) => (
  <div className="mt-2 flex flex-wrap gap-1">
    {languages.map(lang => (
      <Badge 
        key={lang} 
        variant={preferredLanguages.includes(lang) ? "success" : "secondary"}
        className="text-xs"
      >
        {lang}
      </Badge>
    ))}
  </div>
);

// Component for therapist rating
const TherapistRating: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="text-amber-500 mr-2">★ {rating.toFixed(1)}</span>
);

// Component for distance display
const DistanceDisplay: React.FC<{ distance: number }> = ({ distance }) => {
  const { t } = useTranslation();
  return (
    <span className="text-gray-500 text-xs">
      {distance} km {t('common.away')}
    </span>
  );
};

interface TherapistCardProps {
  therapist: Therapist;
  userLocation: { lat: number; lng: number } | null;
  showLanguages?: boolean;
  showRating?: boolean;
  preferredLanguages?: string[];
}

const TherapistCard: React.FC<TherapistCardProps> = ({
  therapist,
  userLocation,
  showLanguages = false,
  showRating = false,
  preferredLanguages = [],
}) => {
  const { t } = useTranslation();

  // Extract therapist profile data
  // Based on errors, we're going to try accessing therapist properties directly
  // instead of through a profile object
  const therapistLocation = therapist.location;
  const therapistLanguages = therapist.languages || [];
  const therapistStatus = therapist.status || 'offline';
  const therapistRating = therapist.rating;
  const businessName = therapist.business_name;
  const priceRangeMin = therapist.price_range_min;
  const currency = therapist.currency;
  
  // Calculate distance between user and therapist if locations are available
  const distance = userLocation && 
    therapistLocation?.lat && 
    therapistLocation?.lng
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          therapistLocation.lat,
          therapistLocation.lng
        )
      : null;
  
  // Filter therapist languages to show which ones match user preferences
  const matchingLanguages = therapistLanguages.filter(
    lang => preferredLanguages?.includes(lang)
  ) || [];
  
  return (
    <Card className="overflow-hidden">
      <Link href={`/tourist/therapists/${therapist.id}`}>
        <div className="relative h-32">
          {therapist.profile_picture ? (
            <Image
              src={therapist.profile_picture}
              alt={therapist.name || 'Therapist'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              <span className="text-gray-400">{t('common.noImage')}</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <TherapistAvailabilityStatus therapistId={therapist.id} />
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-medium">{therapist.name}</h3>
          
          {businessName && (
            <p className="text-sm text-gray-500 mt-1">{businessName}</p>
          )}
          
          <div className="flex items-center mt-2 text-sm">
            {showRating && therapistRating && (
              <TherapistRating rating={therapistRating} />
            )}
            
            {distance !== null && (
              <DistanceDisplay distance={distance} />
            )}
          </div>
          
          {showLanguages && 
           therapistLanguages.length > 0 && (
            <LanguageBadges 
              languages={therapistLanguages}
              preferredLanguages={matchingLanguages}
            />
          )}
          
          {priceRangeMin && currency && (
            <div className="mt-2 text-blue-600 font-medium">
              {priceRangeMin} {currency} ~
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
};

// Distance calculation utility function
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  // Haversine formula for calculating distance between two points on Earth
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return Math.round(distance);
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

export default TherapistCard;