// src/app/(common)/therapists/[therapistId]/components/TherapistFilter.tsx
"use client";
import React, { useCallback, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useFetchServiceCategories } from "@/hooks/api/useFetchServiceCategories";

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

const TherapistFilter: React.FC<TherapistFilterProps> = ({
  isOpen,
  onClose,
  initialFilter,
}) => {
  const [location, setLocation] = useState<string>(
    initialFilter.location || "",
  );
  const [service, setService] = useState<string>(initialFilter.service || "");
  const [language, setLanguage] = useState<string>(
    initialFilter.language || "",
  );
  const [category, setCategory] = useState<string>(
    initialFilter.category || "",
  );
  const router = useRouter();
  const { categories, loading } = useFetchServiceCategories();

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (service) params.set("service", service);
    if (language) params.set("language", language);
    if (category) params.set("category", category);
    router.push(`/tourist/therapists?${params.toString()}`);
    onClose();
  }, [location, service, language, category, router, onClose]);

  const clearFilters = useCallback(() => {
    setLocation("");
    setService("");
    setLanguage("");
    setCategory("");
    router.push("/tourist/therapists");
    onClose();
  }, [router, onClose]);

  if (loading) return <div>カテゴリをロード中...</div>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Therapists</DialogTitle>
          <DialogDescription>
            絞り込み条件を選択してください。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例: ウブド"
            />
          </div>
          <div>
            <Label htmlFor="service-category">Service Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="service-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="例: 日本語"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={clearFilters} className="mr-2">
            クリア
          </Button>
          <Button onClick={applyFilters}>適用する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TherapistFilter;
