// src/app/tourist/local-experiences/components/ExperienceList.tsx
import React from "react";
import ExperienceCard from "./ExperienceCard";
import { LocalExperience } from "@/types/local-experience";

type ExperienceListProps = {
  experiences: LocalExperience[];
};

const ExperienceList: React.FC<ExperienceListProps> = ({ experiences }) => {
  return (
    <div className="space-y-6">
      {experiences.map((experience) => (
        <ExperienceCard
          key={experience.id}
          experience={{
            ...experience,
            description: experience.description ?? "",
            location: experience.location ?? "",
            category_id: experience.category_id ?? "",
            thumbnail_url: experience.thumbnail_url ?? "",
          }}
        />
      ))}
    </div>
  );
};

export default ExperienceList;
