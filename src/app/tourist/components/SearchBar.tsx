"use client";
// src/app/tourist/components/SearchBar.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  const doSearch = () => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        router.push(`/tourist/therapists?search=${searchQuery}`);
      }
    }
  };

  const handleSearch = useMemo(() => debounce(doSearch, 300), [searchQuery, onSearch, router]);

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      <Input
        type="text"
        placeholder={t("search.placeholder", "Search for therapists...")} // <-- ここを修正
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow"
      />
      <Button onClick={handleSearch} className="ml-4">
        {t("search.button", "Search")}
      </Button>
    </div>
  );
};

export default SearchBar;
