"use client";
// src/app/(common)/search/page.tsx
import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/(common)/search/components/SearchBar";
import FilterModal from "@/app/(common)/search/components/FilterModal";
import TrendDisplay from "@/app/(common)/search/components/TrendDisplay";
import { useBottomSheet } from "@/app/hooks/ui/useBottomSheet";
import BottomNavigation from "@/app/components/common/BottomNavigation";
import dynamic from "next/dynamic";

// Define FilterOptions type
interface FilterOptions {
  [key: string]: any;
}

interface SearchResultsProps {
  query: string;
}

// Dynamic imports
const SearchResults = dynamic(() => import("@/app/(common)/search/components/SearchResults").then(mod => mod.default), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-md" />,
  ssr: false,
});

const MapView = dynamic(() => import("@/app/(common)/search/components/MapView").then(mod => mod.default), {
  loading: () => (
    <div className="flex justify-center items-center h-80 bg-gray-50 rounded-md">
      <div className="text-gray-500">地図をロード中...</div>
    </div>
  ),
  ssr: false,
});

// Define props interface for ErrorBoundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Define state interface for ErrorBoundary
interface ErrorBoundaryState {
  hasError: boolean;
}

// ErrorBoundary class component with explicit props and state typing
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-600 font-medium">エラーが発生しました</h3>
          <p className="text-sm text-red-500">
            コンポーネントの読み込み中にエラーが発生しました。ページを再読み込みしてください。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            ページを再読み込み
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const SearchPage = () => {
  const { isOpen, onClose } = useBottomSheet();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (query: string) => setSearchQuery(query);

  const handleApplyFilters = (filters: FilterOptions) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/tourist/search?query=${encodeURIComponent(searchQuery)}&${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 px-4 py-8 space-y-6">
        <SearchBar onSearch={handleSearch} />
        <ErrorBoundary>
          <Suspense fallback={<div className="h-20 bg-gray-100 animate-pulse rounded-md" />}>
            <TrendDisplay />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-md" />}>
            <SearchResults query={searchQuery} />
          </Suspense>
        </ErrorBoundary>
        <div style={{ height: "400px", width: "100%" }}>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-full bg-gray-50 rounded-md">
                  <div className="text-gray-500">地図をロード中...</div>
                </div>
              }
            >
              <MapView />
            </Suspense>
          </ErrorBoundary>
        </div>
        <FilterModal
          isOpen={isOpen}
          onClose={onClose}
          onApplyFilters={handleApplyFilters}
        />
      </main>
      <BottomNavigation userType="tourist" />
    </div>
  );
};

export default SearchPage;