"use client";
// src/app/(common)/therapists/[therapistId]/components/FilterPanel.tsx
import React, { FC, useState } from "react";
import { useFetchServiceCategories } from "@/hooks/api/useFetchServiceCategories";
// --- FIX: Import hook and type from their correct sources ---
import { useTherapistSearch, TherapistSearchResult } from "@/hooks/api/useTherapistSearch"; // Import hook and type from hook file
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { useTranslation } from "next-i18next";

interface ServiceCategory {
  id: string;
  name: string;
}

interface FilterState {
  serviceCategories: string[];
  languages: string[];
  isAvailable: boolean;
}

export interface FilterPanelProps {
  therapistId: string;
  onFilterChange: (filters: FilterState) => void;
}

// --- NOTE on CodeScene warnings (Complex & Large Method): ---
// --- Consider refactoring in the future for better maintainability. ---
const FilterPanel: FC<FilterPanelProps> = ({ therapistId, onFilterChange }) => {
  const { t } = useTranslation("common");
  const [filters, setFilters] = useState<FilterState>({
    serviceCategories: [],
    languages: [],
    isAvailable: false,
  });

  // Fetch service categories
  const { categories: serviceCategories, loading: categoriesLoading, error: categoriesError } = useFetchServiceCategories();

  // Fetch therapist search results
  // --- NOTE: This hook call will only work correctly AFTER useTherapistSearch ---
  // --- is fixed to RETURN an object like { results, loading, error, ... } ---
  // --- and the TherapistSearchResult type issue is resolved in the hook file. ---
  const { results, loading: therapistLoading, error: therapistError } = useTherapistSearch();

  // Find the specific therapist's data using the correctly imported type
  const therapistData = results?.find((result: TherapistSearchResult) => result.id === therapistId);

  const handleCheckboxChange = (
    key: keyof FilterState,
    value: string | boolean,
    checked: boolean | 'indeterminate'
  ): void => {
    const isChecked = typeof checked === 'boolean' ? checked : false;

    setFilters((prev) => {
      const newFilters = { ...prev };
      if (key === "isAvailable") {
        newFilters[key] = isChecked;
      } else {
        const currentValues = newFilters[key]; // string[]
        const stringValue = String(value);

        if (isChecked) {
          if (!currentValues.includes(stringValue)) {
            newFilters[key] = [...currentValues, stringValue];
          }
        } else {
          newFilters[key] = currentValues.filter((v) => v !== stringValue);
        }
      }
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  // Handle loading state for categories
  if (categoriesLoading || therapistLoading) {
    return <div className="flex justify-center p-4"><Spinner /></div>;
  }

  // Handle error state for categories
  if (categoriesError || therapistError) {
    return (
      <Alert variant="error">
        <p>{t("filterPanel.error")}: {categoriesError?.message || therapistError?.message}</p>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>{t("filterPanel.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Service Categories Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">{t("filterPanel.services")}</h3>
          {serviceCategories?.length === 0 ? (
             <p className="text-xs text-muted-foreground">{t("filterPanel.noServices")}</p>
          ) : (
            serviceCategories?.map((category) => (
              <div key={category.id} className="flex items-center space-x-2 mt-1">
                <Checkbox
                  id={`service-${category.id}`}
                  checked={filters.serviceCategories.includes(category.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("serviceCategories", category.id, checked)
                  }
                />
                <Label htmlFor={`service-${category.id}`} className="text-sm font-normal">{category.name}</Label>
              </div>
            ))
          )}
        </div>

        {/* Languages Section */}
        {therapistData?.languages && therapistData.languages.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">{t("filterPanel.languages")}</h3>
            {therapistData.languages.map((lang: string) => (
              <div key={lang} className="flex items-center space-x-2 mt-1">
                <Checkbox
                  id={`lang-${lang}`}
                  checked={filters.languages.includes(lang)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("languages", lang, checked)
                  }
                />
                <Label htmlFor={`lang-${lang}`} className="text-sm font-normal">{lang}</Label>
              </div>
            ))}
          </div>
        )}

        {/* Availability Section */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="available"
            checked={filters.isAvailable}
            onCheckedChange={(checked) =>
              handleCheckboxChange("isAvailable", true, checked)
            }
          />
          <Label htmlFor="available" className="text-sm font-normal">{t("filterPanel.availableNow")}</Label>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4"
          onClick={() => {
            const resetFilters: FilterState = {
              serviceCategories: [],
              languages: [],
              isAvailable: false,
            };
            setFilters(resetFilters);
            onFilterChange(resetFilters);
          }}
        >
          {t("filterPanel.reset")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;