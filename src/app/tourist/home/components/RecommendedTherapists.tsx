// src/app/tourist/home/components/RecommendedTherapists.tsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import TherapistCard from "@/app/(common)/search/components/TherapistCard";
import { Spinner } from "@/app/components/ui/Spinner";
import { useTranslation } from "react-i18next";
import { Therapist } from "@/types/therapist";

interface RecommendedTherapistsProps {
  therapists?: Therapist[];
  userLocation: { lat: number; lng: number } | null;
  preferences?: {
    categories: string[];
    languages: string[];
    gender?: string;
  };
}

const RecommendedTherapists: React.FC<RecommendedTherapistsProps> = ({
  therapists = [],
  userLocation,
  preferences,
}) => {
  const { t } = useTranslation();
  
  if (!therapists.length) {
    return (
      <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-700">
            {t('therapists.recommended')}
          </h2>
          <Link href="/tourist/therapists" className="text-sm text-blue-500">
            {t('common.seeAll')}
          </Link>
        </div>
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-gray-500">{t('therapists.noTherapistsFound')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-700">
          {t('therapists.recommended')}
        </h2>
        <Link href="/tourist/therapists" className="text-sm text-blue-500">
          {t('common.seeAll')}
        </Link>
      </div>
      
      <Swiper spaceBetween={10} slidesPerView={1.2}>
        {therapists.map((therapist) => (
          <SwiperSlide key={therapist.id}>
            <TherapistCard 
              therapist={therapist} 
              userLocation={userLocation}
              showLanguages={true}
              showRating={true}
              preferredLanguages={preferences?.languages}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default RecommendedTherapists;