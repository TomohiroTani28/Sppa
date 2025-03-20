// src/app/tourist/therapists/page.tsx
"use client";
import React, { useMemo, useCallback } from "react";
import TouristLayout from "@app/tourist/components/TouristLayout";
import TherapistList from "./components/TherapistList";
import TherapistFilter from "./components/TherapistFilter";
import { useBottomSheet } from "@app/hooks/ui/useBottomSheet";
import { Button } from "@app/components/ui/Button";
import { useSearchParams } from "next/navigation";
import Text from "@app/components/ui/Text";
import useRealtimeReviews from "@app/hooks/realtime/useRealtimeReviews";

// Define the filter interface for TherapistList (coordinates)
interface TherapistListFilter {
  location: { lat?: number; lng?: number };
  service: string;
  language: string;
  category: string;
}

// Define the filter interface for TherapistFilter (string location)
interface TherapistFilterProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilter: {
    location: string;
    service: string;
    language: string;
    category: string;
  };
}

const TouristTherapistsPage = () => {
  const { isOpen, onOpen, onClose } = useBottomSheet();
  const searchParams = useSearchParams();

  const therapistId = searchParams.get("therapistId") || "default-id";
  useRealtimeReviews(therapistId);

  // Filter for TherapistList (with coordinates)
  const listFilter = useMemo((): TherapistListFilter => {
    const locationParam = searchParams.get("location") || "";
    let location: { lat?: number; lng?: number } = {};

    // Parse location string (e.g., "lat,lng") into coordinates
    if (locationParam.includes(",")) {
      const [lat, lng] = locationParam.split(",").map(Number);
      location = {
        lat: isNaN(lat) ? undefined : lat,
        lng: isNaN(lng) ? undefined : lng,
      };
    }

    return {
      location,
      service: searchParams.get("service") || "",
      language: searchParams.get("language") || "",
      category: searchParams.get("category") || "",
    };
  }, [searchParams]);

  // Filter for TherapistFilter (with string location)
  const filterComponentFilter = useMemo(() => ({
    location: searchParams.get("location") || "",
    service: searchParams.get("service") || "",
    language: searchParams.get("language") || "",
    category: searchParams.get("category") || "",
  }), [searchParams]);

  const handleOpen = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <TouristLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Text variant="title">Find Your Perfect Bali Therapist</Text>
          <Button variant="outline" size="sm" onClick={handleOpen}>
            フィルター
          </Button>
        </div>
        <Text variant="body" className="mb-4 text-gray-600">
          Explore a curated selection of Bali's finest therapists. Watch videos
          and browse photos to discover the ideal therapist for your relaxation
          and wellness journey.
        </Text>
        <TherapistList initialFilter={listFilter} />
        <TherapistFilter
          isOpen={isOpen}
          onClose={handleClose}
          initialFilter={filterComponentFilter}
        />
      </div>
    </TouristLayout>
  );
};

export default TouristTherapistsPage;