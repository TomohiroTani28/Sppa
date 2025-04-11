// src/components/FeedFilters.tsx
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { useFeedStore } from "@/hooks/useFeedStore";
import { gql, useQuery } from "@apollo/client";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

const GET_SERVICE_CATEGORIES = gql(`
  query GetServiceCategories {
    service_categories(where: { parent_category_id: { _is_null: true } }) {
      id
      name
    }
  }
`);

interface FeedFiltersState {
  categoryId: string | null;
  isAvailableOnly: boolean;
}

const FeedFilters: React.FC = () => {
  const { t } = useTranslation();
  const { filters, setFilters } = useFeedStore();
  const { data, loading, error } = useQuery(GET_SERVICE_CATEGORIES);

  const handleCategoryChange = useCallback(
    (category: string) => {
      setFilters({ ...filters, categoryId: category });
    },
    [filters, setFilters]
  );

  const handleAvailabilityChange = useCallback(
    (checked: boolean) => {
      setFilters({ ...filters, isAvailableOnly: checked });
    },
    [filters, setFilters]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner />
        <span className="ml-2">{t("loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {t("error")}: {error.message}
      </div>
    );
  }

  const categories = data?.service_categories ?? [];

  return (
    <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="category-filter">
          <span>{t("feedFilters.category")}</span>
        </Label>
        <Select
          {...(filters.categoryId && { value: filters.categoryId })}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="category-filter" className="w-full">
            <SelectValue placeholder={t("feedFilters.selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("feedFilters.allCategories")}</SelectItem>
            {categories.map((category: { id: string; name: string; }) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="availability-filter"
          checked={filters.isAvailableOnly}
          onCheckedChange={handleAvailabilityChange}
        />
        <Label htmlFor="availability-filter">
          <span>{t("feedFilters.availableOnly")}</span>
        </Label>
      </div>
    </div>
  );
};

export default FeedFilters;