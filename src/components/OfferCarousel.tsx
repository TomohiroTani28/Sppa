// src/components/OfferCarousel.tsx
import React from "react";

// Define interfaces for better type safety
export interface Event {
  id: string;
  title: string;
  // Add other event properties as needed
}

export interface Experience {
  id: string;
  title: string;
  // Add other experience properties as needed
}

export interface OfferCarouselProps {
  events: Event[];
}

export interface RecommendedExperiencesProps {
  experiences: Experience[];
}

// First component
export const OfferCarousel: React.FC<OfferCarouselProps> = ({ events }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Featured Events</h2>
      <div className="flex overflow-x-auto">
        {events.map((event) => (
          <div key={event.id} className="flex-shrink-0 mr-4">
            {/* Display event details */}
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
};

// Second component
export const RecommendedExperiences: React.FC<RecommendedExperiencesProps> = ({ experiences }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended Experiences</h2>
      {experiences.map((experience) => (
        <div key={experience.id}>
          {/* Display experience details */}
          {experience.title}
        </div>
      ))}
    </div>
  );
};

// Export a default component if needed, but only one
export default OfferCarousel;