// src/app/tourist/local-experiences/page.tsx
"use client";

import TouristLayout from "@/app/(common)/components/TouristLayout";
import BottomNavigation from "@/app/components/common/BottomNavigation";
import { useFetchLocalExperiences } from "@/app/hooks/api/useFetchLocalExperiences";
import { useEffect, useState } from "react";
import ExperienceCard from "./components/ExperienceCard";

const categories = [
  { id: "d2587e51-90b6-4d3e-a1f0-44cd7d5a68a7", name: "ビーチアクティビティ" },
  { id: "84b2e65c-cb6f-4f62-9df9-dc1cd7d18767", name: "寺院ツアー" },
];

const LocalExperiencesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { experiences, loading, error, fetchExperiences } = useFetchLocalExperiences();

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleCategoryChange = async (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    await fetchExperiences({ where: categoryId ? { category_id: categoryId } : {} });
  };

  return (
    <TouristLayout>
      <div className="bg-gray-50 min-h-screen pb-16">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            バリ島ローカル体験
          </h1>

          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === null
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                すべて
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {loading && experiences.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          )}

          {error && experiences.length === 0 && (
            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <p className="text-red-600 mb-2">体験情報の取得中にエラーが発生しました。</p>
              <button
                onClick={() => fetchExperiences()}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition"
              >
                再試行
              </button>
            </div>
          )}

          {experiences.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {experiences.map((experience) => (
                <ExperienceCard
                  key={experience.id}
                  experience={{
                    ...experience,
                    description: experience.description ?? "",
                    location: experience.location ?? "",
                    category_id: experience.category_id ?? "",
                    thumbnail_url: experience.thumbnail_url ?? "",
                  }}
                />
              ))}
            </div>
          ) : !loading && !error ? (
            <p className="text-center text-gray-500 my-12">
              {selectedCategory
                ? "このカテゴリーには現在体験がありません。"
                : "現在利用可能な体験はありません。"}
            </p>
          ) : null}

          {loading && experiences.length > 0 && (
            <div className="flex justify-center my-6">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <BottomNavigation userType="tourist" />
      </div>
    </TouristLayout>
  );
};

export default LocalExperiencesPage;
