"use client";
// src/app/(common)/therapists/[therapistId]/components/FilterPanel.tsx
import React, { FC, useState } from "react";
import { useFetchServiceCategories } from "@/hooks/api/useFetchServiceCategories";
import { useTherapistSearch } from "@/hooks/api/useTherapistSearch";
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

const FilterPanel: FC<FilterPanelProps> = ({ therapistId, onFilterChange }) => {
  const { t } = useTranslation("common");
  const [filters, setFilters] = useState<FilterState>({
    serviceCategories: [],
    languages: [],
    isAvailable: false,
  });

  const { categories: serviceCategories, loading, error } = useFetchServiceCategories();
  const { results } = useTherapistSearch();
  const therapistData = results?.find((result) => result.id === therapistId);

  // チェックボックス変更ハンドラをシンプル化
  const handleCheckboxChange = (
    key: keyof FilterState,
    value: string | boolean,
    checked: boolean
  ): void => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      
      if (key === "isAvailable") {
        newFilters[key] = checked;
      } else {
        const currentValues = newFilters[key] as string[];
        const stringValue = String(value);
        newFilters[key] = checked
          ? currentValues.includes(stringValue)
            ? currentValues
            : [...currentValues, stringValue]
          : currentValues.filter((v) => v !== stringValue);
      }

      onFilterChange(newFilters);
      return newFilters;
    });
  };

  if (loading) return <div className="flex justify-center p-4"><Spinner /></div>;
  if (error) return <Alert variant="error"><p>{t("filterPanel.error", { message: error.message })}</p></Alert>;

  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>{t("filterPanel.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Service Categories */}
        <div>
          <h3 className="text-sm font-medium">{t("filterPanel.services")}</h3>
          {serviceCategories?.map((category) => (
            <div key={category.id} className="flex items-center space-x-2 mt-2">
              <Checkbox
                id={`service-${category.id}`}
                checked={filters.serviceCategories.includes(category.id)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("serviceCategories", category.id, !!checked)
                }
              />
              <Label htmlFor={`service-${category.id}`}>{category.name}</Label>
            </div>
          ))}
        </div>

        {/* Therapist Languages */}
        <div>
          <h3 className="text-sm font-medium">{t("filterPanel.languages")}</h3>
          {therapistData?.languages.map((lang) => (
            <div key={lang} className="flex items-center space-x-2 mt-2">
              <Checkbox
                id={`lang-${lang}`}
                checked={filters.languages.includes(lang)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("languages", lang, !!checked)
                }
              />
              <Label htmlFor={`lang-${lang}`}>{lang}</Label>
            </div>
          ))}
        </div>

        {/* Availability */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="available"
            checked={filters.isAvailable}
            onCheckedChange={(checked) =>
              handleCheckboxChange("isAvailable", true, !!checked)
            }
          />
          <Label htmlFor="available">{t("filterPanel.availableNow")}</Label>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full"
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