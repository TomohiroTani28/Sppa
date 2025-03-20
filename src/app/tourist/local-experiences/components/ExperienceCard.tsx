// src/app/tourist/local-experiences/components/ExperienceCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LocalExperience } from "@/app/api/experiences/route";

interface ExperienceCardProps {
  experience: LocalExperience;
  className?: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  className,
}) => {
  return (
    <Link href={`/tourist/local-experiences/${experience.id}`}>
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 
                  hover:shadow-lg cursor-pointer ${className || ""}`}
      >
        <div className="relative h-48 w-full bg-gray-200">
          <Image
            src={experience.thumbnail_url || "/images/event1.jpg"}
            alt={experience.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={(e) => {
              // 画像ロードエラー時のフォールバック
              const target = e.target as HTMLImageElement;
              target.src = "/images/event1.jpg";
            }}
            priority={false}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 line-clamp-1 text-gray-800">
            {experience.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {experience.location}
          </p>
          <p className="text-sm text-gray-700 line-clamp-2">
            {experience.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ExperienceCard;
