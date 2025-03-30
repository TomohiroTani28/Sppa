// src/app/components/common/HomeContent.tsx
import RecommendedTherapists from "@/app/(common)/home/components/RecommendedTherapists";
import React from "react";
// Import from the correct location
import OfferCarousel, { RecommendedExperiences } from "@/app/components/common/OfferCarousel";

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