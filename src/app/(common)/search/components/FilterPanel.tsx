"use client";
// src/app/(common)/search/components/FilterPanel.tsx
import { useState } from "react";
import {
  Select as RadixSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Button } from "@/components/ui/Button";

interface FilterPanelProps {
  onApplyFilters: (filters: Record<string, string>) => void;
}

export default function FilterPanel({ onApplyFilters }: FilterPanelProps) {
  const [language, setLanguage] = useState("");
  const [status, setStatus] = useState("");

  const applyFilters = () => {
    onApplyFilters({ language, status });
  };

  return (
    <div className="flex gap-4 items-end mb-6">
      <RadixSelect onValueChange={setLanguage} value={language}>
        <SelectTrigger>
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="English">English</SelectItem>
          <SelectItem value="Indonesian">Indonesian</SelectItem>
        </SelectContent>
      </RadixSelect>

      <RadixSelect onValueChange={setStatus} value={status}>
        <SelectTrigger>
          <SelectValue placeholder="Availability" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
        </SelectContent>
      </RadixSelect>

      <Button onClick={applyFilters}>Apply</Button>
    </div>
  );
}