"use client";
// src/app/(common)/search/components/SearchBar.tsx
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onTap?: () => void;
  onChange?: (query: string) => void;
  isActive?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search therapists or services...",
  onTap,
  onChange,
  isActive,
  onSearch,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (onChange) {
      onChange(newQuery); // Call onChange if provided (for chat page)
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query); // Call onSearch if provided (for search page)
    }
  };

  return (
    <div className={cn("flex gap-2", className)} onClick={onTap}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className={isActive ? "border-blue-500" : ""}
      />
      {onSearch && <Button onClick={handleSearch}>Search</Button>}
    </div>
  );
}