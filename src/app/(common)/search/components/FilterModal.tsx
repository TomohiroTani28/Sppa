// src/app/(common)/search/components/FilterModal.tsx
"use client";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { useServices } from "@/hooks/api/useServices";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Define FilterOptions type (consistent with SearchPage)
interface FilterOptions {
  [key: string]: any; // Adjust based on your actual filter structure
}

interface FilterOption {
  id: string;
  label: string;
  values: string[];
}

// Update FilterModalProps to include onApplyFilters
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void; // Add this prop
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const router = useRouter();
  const { categories, services, loading } = useServices({ initialLoad: true });

  const filterOptions: FilterOption[] = React.useMemo(() => {
    const options: FilterOption[] = [];
    if (categories && categories.length > 0) {
      options.push({
        id: "category",
        label: "カテゴリー",
        values: categories.map((category) => category.name),
      });
    }
    options.push(
      { id: "priceRange", label: "価格帯", values: ["~$50", "$50-$100", "$100-$200", "$200~"] },
      { id: "duration", label: "施術時間", values: ["~30分", "30分-1時間", "1時間-2時間", "2時間~"] },
      { id: "rating", label: "評価", values: ["5★", "4★以上", "3★以上"] },
      { id: "language", label: "対応言語", values: ["英語", "日本語", "インドネシア語", "中国語"] }
    );
    return options;
  }, [categories, services]);

  const applyFiltersHandler = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/tourist/therapists?${params.toString()}`);
    onApplyFilters(filters); // Pass filters back to SearchPage
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="p-4 text-center">フィルターをロード中...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>セラピスト検索フィルター</DialogTitle>
          <DialogDescription>検索条件を設定してください。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {filterOptions.map((option) => (
            <div key={option.id} className="space-y-2">
              <Label htmlFor={option.id}>{option.label}</Label>
              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, [option.id]: value })
                }
                value={String(filters[option.id] || "")}
              >
                <SelectTrigger id={option.id}>
                  <SelectValue placeholder={`${option.label}を選択`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">すべて</SelectItem>
                  {option.values.map((val) => (
                    <SelectItem key={val} value={val}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-2">
            キャンセル
          </Button>
          <Button onClick={applyFiltersHandler}>適用する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;