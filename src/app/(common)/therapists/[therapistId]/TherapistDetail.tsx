// src/app/(common)/therapists/[therapistId]/TherapistDetail.tsx
"use client";

import React from "react";
import { useQuery, gql } from '@apollo/client';
import { Therapist } from '@/types/therapist';
import { TherapistAvailabilityStatus } from '@/components/TherapistAvailabilityStatus';
import RatingStars from '@/components/RatingStars';

// GraphQL クエリの定義（Hasuraのスキーマに合わせて `therapist_by_pk` を使用）
const GET_THERAPIST = gql`
  query GetTherapist($id: uuid!) {
    therapist_by_pk(id: $id) {
      name
      bio
      profile_picture
      location
      languages
      price_range_min
      price_range_max
      currency
      experience_years
      business_name
      rating
    }
  }
`;

interface TherapistDetailProps {
  therapistId: string;
}

const TherapistDetail: React.FC<TherapistDetailProps> = ({ therapistId }) => {
  const { data, loading, error } = useQuery(GET_THERAPIST, {
    variables: { id: therapistId },
  });

  if (loading) {
    return <p className="text-center py-8">Loading therapist details...</p>;
  }
  if (error || !data?.therapist_by_pk) {
    return (
      <p className="text-center py-8 text-red-500">
        Error loading therapist details. Please try again later.
      </p>
    );
  }

  const therapist: Therapist = data.therapist_by_pk;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <ProfileHeader therapist={therapist} therapistId={therapistId} />
      <Biography bio={therapist.bio || ""} />
      <AdditionalInfo therapist={therapist} />
    </div>
  );
};

interface ProfileHeaderProps {
  therapist: Therapist;
  therapistId: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  therapist,
  therapistId,
}) => (
  <div className="flex flex-col md:flex-row md:items-center">
    {/* プロフィール画像 */}
    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
      <img
        src={therapist.profile_picture || "/default-profile.jpg"}
        alt={therapist.name}
        className="w-24 h-24 rounded-full object-cover"
      />
    </div>

    {/* 基本情報 */}
    <div className="flex-grow">
      <div className="flex items-center mb-2">
        <h1 className="text-2xl font-bold mr-3">{therapist.name}</h1>
        <TherapistAvailabilityStatus therapistId={therapistId} />
      </div>
      <div className="mb-3 flex items-center">
        <RatingStars rating={therapist.rating || 0} />
        <span className="ml-2 text-sm text-gray-600">
          {therapist.rating
            ? `(${therapist.rating} avg rating)`
            : "New therapist"}
        </span>
      </div>
      <TherapistContactInfo therapist={therapist} />
    </div>
  </div>
);

interface TherapistContactInfoProps {
  therapist: Therapist;
}

const TherapistContactInfo: React.FC<TherapistContactInfoProps> = ({
  therapist,
}) => {
  // 料金表示用のロジック
  const renderPrice = () => {
    if (!therapist.price_range_min || !therapist.price_range_max) {
      return <span>Price not specified</span>;
    }
    if (therapist.price_range_min === therapist.price_range_max) {
      return (
        <span>
          {therapist.price_range_min} {therapist.currency}/session
        </span>
      );
    }
    return (
      <span>
        {therapist.price_range_min} - {therapist.price_range_max}{" "}
        {therapist.currency}/session
      </span>
    );
  };

  return (
    <>
      {/* ロケーション情報 */}
      <div className="text-gray-600 mb-2">
        <span className="inline-flex items-center">
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
          {therapist.location?.address || "Location not specified"}
        </span>
      </div>

      {/* 言語情報 */}
      <div className="text-gray-600 mb-3">
        <span className="inline-flex items-center">
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
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          {therapist.languages && therapist.languages.length > 0
            ? therapist.languages.join(", ")
            : "No languages specified"}
        </span>
      </div>

      {/* 料金 */}
      <div className="text-gray-800 font-semibold">{renderPrice()}</div>
    </>
  );
};

interface BiographyProps {
  bio?: string;
}

const Biography: React.FC<BiographyProps> = ({ bio }) => (
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-2">About</h2>
    <p className="text-gray-700">{bio || "No biography available."}</p>
  </div>
);

interface AdditionalInfoProps {
  therapist: Therapist;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ therapist }) => (
  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <h2 className="text-lg font-semibold mb-2">Experience</h2>
      <p className="text-gray-700">
        {therapist.experience_years
          ? `${therapist.experience_years} years`
          : "Experience not specified"}
      </p>
    </div>
    <div>
      <h2 className="text-lg font-semibold mb-2">Business</h2>
      <p className="text-gray-700">
        {therapist.business_name || "Business name not specified"}
      </p>
    </div>
  </div>
);

export default TherapistDetail;