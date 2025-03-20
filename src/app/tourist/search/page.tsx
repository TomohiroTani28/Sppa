"use client";
// src/app/tourist/search/page.tsx
import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import SearchBar from "../components/SearchBar";
import FilterModal from "./components/FilterModal";
import TrendDisplay from "./components/TrendDisplay";
import { useBottomSheet } from "@/app/hooks/ui/useBottomSheet";
import BottomNavigation from "@/app/components/common/BottomNavigation";
import dynamic from "next/dynamic";

// Define FilterOptions type (consistent with FilterModal)
interface FilterOptions {
 [key: string]: any; // Adjust based on actual filter structure
}

interface SearchResultsProps {
 query: string;
}

const SearchResults = dynamic(
 () =>
 import("@/app/tourist/search/components/SearchResults").then(
 (mod) => mod.default as unknown as React.ComponentType<SearchResultsProps>
 ),
 {
 loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-md" />,
 ssr: false,
 }
);

const MapView = dynamic(
 () =>
 import("@/app/tourist/search/components/MapView")
 .then((mod) => mod.default as unknown as React.ComponentType<{}>)
 .catch(() => {
 const Fallback: React.FC = () => <div>MapView failed to load</div>;
 return Fallback;
 }),
 {
 loading: () => (
 <div className="flex justify-center items-center h-80 bg-gray-50 rounded-md">
 <div className="text-gray-500">地図をロード中...</div>
 </div>
 ),
 ssr: false,
 }
);

// ErrorBoundary component
function ErrorBoundary({ children }: Readonly<{ children: React.ReactNode }>) {
 const [hasError, setHasError] = useState(false);

 React.useEffect(() => {
 const handleError = () => setHasError(true);
 window.addEventListener("error", handleError);
 return () => window.removeEventListener("error", handleError);
 }, []);

 if (hasError) {
 return (
 <div className=" p-4 bg-red-50 border border-red-200 rounded-md">
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
 return <>{children}</>;
}

const SearchPage = () => {
 const { isOpen, onClose } = useBottomSheet();
 const [searchQuery, setSearchQuery] = useState("");
 const router = useRouter(); // Add router for filter navigation

 const handleSearch = (query: string) => {
 setSearchQuery(query);
 };

 // Handle filters applied from FilterModal
 const handleApplyFilters = (filters: FilterOptions) => {
 const params = new URLSearchParams();
 Object.entries(filters).forEach(([key, value]) => {
 if (value) params.set(key, value);
 });
 // Update URL with filters and search query
 router.push(`/tourist/search?query=${encodeURIComponent(searchQuery)}&${params.toString()}`);
 };

 return (
 <div className="flex flex-col min-h-screen bg-gray-50">
 <main className="flex-1 px-4 py-8 space-y-6">
 <SearchBar onSearch={handleSearch} />
 <ErrorBoundary>
 <Suspense
 fallback={<div className="h-20 bg-gray-100 animate-pulse rounded-md" />}
 >
 <TrendDisplay />
 </Suspense>
 </ErrorBoundary>
 <ErrorBoundary>
 <Suspense
 fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-md" />}
 >
 <SearchResults query={searchQuery} />
 </Suspense>
 </ErrorBoundary>
 <ErrorBoundary>
 <Suspense
 fallback={
 <div className="flex justify-center items-center h-80 bg-gray-50 rounded-md">
 <div className="text-gray-500">地図をロード中...</div>
 </div>
 }
 >
 <MapView />
 </Suspense>
 </ErrorBoundary>
 <FilterModal
 isOpen={isOpen}
 onClose={onClose}
 onApplyFilters={handleApplyFilters} // Add this prop
 />
 </main>
 <BottomNavigation userType="tourist" />
 </div>
 );
};

export default SearchPage;