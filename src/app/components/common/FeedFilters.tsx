// src/app/components/common/FeedFilters.tsx
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/Select";
import { Checkbox } from "@/app/components/ui/Checkbox";
import { Label } from "@/app/components/ui/Label";
import { Spinner } from "@/app/components/ui/Spinner";
import { useFeedStore } from "@/app/hooks/useFeedStore";

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
          value={filters.categoryId ?? undefined}
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