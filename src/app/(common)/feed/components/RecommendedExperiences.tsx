// src/app/(common)/feed/components/RecommendedExperiences.tsx
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LocalExperience } from "@/types/local-experience";
import { useTranslation } from "next-i18next";
import { Spinner } from "@/components/ui/Spinner";
import { useFetchLocalExperiences } from "@/hooks/api/useFetchLocalExperiences";

// Make sure these match your actual types
interface Media {
  id: string;
  url: string;
  type: string;
  sort_order?: number;
}

interface Location {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
}

interface ExtendedLocalExperience {
  id: string;
  title: string;
  description?: string;
  location?: Location;
  media?: Media[];
  rating?: number;
  category?: string;
}

interface RecommendedExperiencesProps {
  preferences?: {
    categories?: string[];
    interests?: string[];
  };
}

const RecommendedExperiences: React.FC<RecommendedExperiencesProps> = ({
  preferences = {},
}) => {
  // Use the hook directly inside the component
  const { experiences, loading, error, fetchExperiences } = useFetchLocalExperiences();

  // Fetch experiences when component mounts or preferences change
  useEffect(() => {
    const whereClause = preferences.categories?.length
      ? { category: { _in: preferences.categories } }
      : {};
    fetchExperiences({ where: whereClause });
  }, [fetchExperiences, preferences.categories]);

  // Handle translations
  let t;
  try {
    const result = useTranslation();
    t = result.t;
  } catch (error) {
    console.error("Translation hook error:", error);
    t = null;
  }

  // Fallback translation function
  const fallbackT = (key: string) => {
    const translations: Record<string, string> = {
      "experiences.recommended": "Recommended Experiences",
      "experiences.noExperiencesFound": "No experiences found",
      "common.seeAll": "See All",
      "common.noImage": "No Image",
      "common.location": "Location",
      "common.error": "Error loading experiences",
      "common.retry": "Retry",
    };
    return translations[key] || key;
  };

  // Use fallbackT if t is not available
  const translate = typeof t === "function" ? t : fallbackT;

  // Break down the rendering logic to reduce complexity
  const renderExperienceCard = (experience: ExtendedLocalExperience) => (
    <Link
      href={`/tourist/local-experiences/${experience.id}`}
      key={experience.id}
      className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
    >
      <div className="relative h-32">
        {experience.media && experience.media.length > 0 ? (
          <Image
            src={experience.media[0].url}
            alt={experience.title || ""}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">{translate("common.noImage")}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <span className="text-white text-xs font-medium">
            {experience.category || ""}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{experience.title}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {experience.description || ""}
        </p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-blue-500">
            {experience.location?.name || translate("common.location")}
          </span>
          <div className="flex items-center">
            {experience.rating !== undefined && (
              <span className="text-xs text-amber-500 font-medium">
                ★ {experience.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  // Handle loading state
  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {translate("experiences.recommended")}
        </h2>
        <div className="flex justify-center py-8">
          <Spinner className="w-8 h-8" />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {translate("experiences.recommended")}
        </h2>
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">{translate("common.error")}</p>
          <button
            onClick={() => fetchExperiences()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {translate("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  // Render empty state if no experiences
  if (!experiences || experiences.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {translate("experiences.recommended")}
        </h2>
        <p className="text-gray-500 text-center py-8">
          {translate("experiences.noExperiencesFound")}
        </p>
      </div>
    );
  }

  // Render experiences grid
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {translate("experiences.recommended")}
        </h2>
        <Link
          href="/tourist/local-experiences"
          className="text-blue-500 text-sm"
        >
          {translate("common.seeAll")}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {experiences.map((experience) =>
          renderExperienceCard(
            experience as unknown as ExtendedLocalExperience,
          ),
        )}
      </div>
    </div>
  );
};

export default RecommendedExperiences;