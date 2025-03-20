// src/app/tourist/search/components/SearchBar.tsx
"use client";

import { useTranslation } from "react-i18next";

const SearchBar = () => {
  const { t } = useTranslation();

  return (
    <div>
      <input
        type="text"
        placeholder={t("search")}
        className="p-2 border rounded-md w-full"
      />
    </div>
  );
};

export default SearchBar;
