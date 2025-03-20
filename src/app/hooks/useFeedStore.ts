// src/hooks/useFeedStore.ts

import { create } from "zustand";

interface FeedFiltersState {
  categoryId: string | null;
  isAvailableOnly: boolean;
}

interface FeedStore {
  filters: FeedFiltersState;
  setFilters: (newFilters: Partial<FeedFiltersState>) => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
  filters: {
    categoryId: null,
    isAvailableOnly: false,
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
}));