// src/app/(common)/chat/components/SearchBar.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <Input
        type="text"
        placeholder="会話を検索..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
}