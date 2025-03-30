// src/app/components/common/HomeContent.tsx
import React from "react";
import RecommendedTherapists from "@/app/tourist/home/components/RecommendedTherapists";
// Import from the correct location
import { RecommendedExperiences } from "@/app/components/common/OfferCarousel";
import OfferCarousel from "@/app/components/common/OfferCarousel";

interface HomeContentProps {
  events: any[];
  therapists: any[];
  experiences: any[];
  userLocation: any;
  transformedPreferences: any;
}

const HomeContent: React.FC<HomeContentProps> = ({ 
  events, 
  therapists, 
  experiences, 
  userLocation, 
  transformedPreferences 
}) => (
  <main className="p-4">
    {events && events.length > 0 && (
      <div className="mb-6">
        <OfferCarousel events={events} />
      </div>
    )}
    {therapists && therapists.length > 0 && (
      <div className="mb-6">
        <RecommendedTherapists
          therapists={therapists}
          userLocation={userLocation}
          preferences={transformedPreferences}
        />
      </div>
    )}
    {experiences && experiences.length > 0 && (
      <div className="mb-6">
        <RecommendedExperiences experiences={experiences} />
      </div>
    )}
  </main>
);

export default HomeContent;