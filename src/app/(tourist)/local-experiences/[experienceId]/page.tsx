// src/app/(tourist)/local-experiences/[experienceId]/page.tsx
"use client";

import TouristLayout from "@/app/(common)/components/TouristLayout";
import { LocalExperience } from "@/app/api/experiences/route";
import BottomNavigation from "@/components/BottomNavigation";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ExperienceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const experienceId = params.experienceId as string;
  const [experience, setExperience] = useState<LocalExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データ取得ロジック
  const fetchExperienceDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/experiences");
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const foundExperience = Array.isArray(data)
        ? data.find((exp: LocalExperience) => exp.id === experienceId)
        : null;

      if (foundExperience) {
        setExperience(foundExperience);
      } else {
        setError("指定された体験が見つかりませんでした。");
      }
    } catch (err) {
      console.error("体験詳細の取得中にエラーが発生しました:", err);
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (experienceId) {
      fetchExperienceDetail();
    }
  }, [experienceId]);

  // 戻るボタンのハンドラー
  const handleGoBack = () => {
    router.back();
  };

  // ローディング画面
  const renderLoading = () => (
    <TouristLayout>
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="container mx-auto px-4 py-6">
          <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
        </div>
        <BottomNavigation />
      </div>
    </TouristLayout>
  );

  // エラー画面
  const renderError = () => (
    <TouristLayout>
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={handleGoBack}
            className="mb-6 flex items-center text-primary"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            戻る
          </button>
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <p className="text-red-600 mb-4">
              {error || "体験情報の取得中にエラーが発生しました。"}
            </p>
            <button
              onClick={() => router.push("/tourist/local-experiences")}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition"
            >
              体験一覧に戻る
            </button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    </TouristLayout>
  );

  // メインコンテンツ
  const renderContent = () => (
    <TouristLayout>
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="relative h-72 sm:h-96 w-full bg-gray-200">
          <Image
            src={experience!.thumbnail_url || "/images/event1.jpg"}
            alt={experience!.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <button
            onClick={handleGoBack}
            className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {experience!.title}
          </h1>
          <div className="flex items-center text-gray-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {experience!.location}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              体験詳細
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {experience!.description}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              予約情報
            </h2>
            <p className="text-gray-700 mb-4">
              この体験の予約やお問い合わせは、下記のボタンからご連絡ください。詳細な価格、所要時間、含まれるもの等について案内いたします。
            </p>
            <button
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              onClick={() => window.alert("予約機能は現在開発中です。")}
            >
              お問い合わせ・予約
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              関連する体験
            </h2>
            <p className="text-gray-700">
              現在表示中の体験に関連するその他のアクティビティをご覧いただけます。
            </p>
            <button
              className="mt-4 text-primary font-medium flex items-center"
              onClick={() => router.push("/tourist/local-experiences")}
            >
              すべての体験を見る
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    </TouristLayout>
  );

  if (loading) return renderLoading();
  if (error || !experience) return renderError();
  return renderContent();
};

export default ExperienceDetailPage;
