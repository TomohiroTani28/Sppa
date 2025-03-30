// src/app/tourist/home/components/RecommendedExperiences.tsx
import React from "react";

export interface RecommendedExperiencesProps {
  experiences: any[];
}

const RecommendedExperiences = ({ experiences }: RecommendedExperiencesProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended Experiences</h2>
      {experiences.map((experience, index) => (
        <div key={index}>
          {/* Display experience details */}
        </div>
      ))}
    </div>
  );
};

// Add type assertion on export
export default RecommendedExperiences as React.FunctionComponent<RecommendedExperiencesProps>;