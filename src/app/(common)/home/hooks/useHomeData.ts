// src/app/tourist/home/hooks/useHomeData.ts
"use client";
import { useEffect, useMemo, useState } from "react";
import { useUserPreferences } from "@/app/tourist/hooks/useUserPreferences";
import { useLocationService } from "@/app/tourist/hooks/useLocationService";
import { useFetchLocalExperiences } from "@/app/hooks/api/useFetchLocalExperiences";
import { useFetchTherapists } from "@/app/hooks/api/useFetchTherapists";
import { useFetchEvents } from "@/app/hooks/api/useFetchEvents";
import { useAuth } from "@/app/hooks/api/useAuth";

/**
 * ホーム画面で必要なデータを効率的に取得するカスタムフック
 * - ユーザー好み設定
 * - 位置情報
 * - おすすめセラピスト
 * - ローカル体験情報
 * - プロモーションイベント
 */
export const useHomeData = () => {
  const { user } = useAuth();
  const { preferences, isLoading: preferencesLoading } = useUserPreferences();
  const { userLocation, loading: locationLoading } = useLocationService();
  
  // ローカル体験の取得（位置情報に基づく）
  const { 
    experiences, 
    loading: experiencesLoading, 
    fetchExperiences 
  } = useFetchLocalExperiences();
  
  // おすすめセラピストの取得（位置情報と好みに基づく）
  const { 
    therapists, 
    loading: therapistsLoading
  } = useFetchTherapists();
  
  // プロモーションイベントの取得
  const { events, loading: eventsLoading } = useFetchEvents();
  
  // ユーザーの言語設定の取得
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  
  // 言語設定の取得（preferences が null や undefined の場合、空配列を利用）
  useEffect(() => {
    const languages = preferences?.preferred_languages ?? [];
    if (languages.length > 0) {
      setPreferredLanguage(languages[0]);
    }
  }, [preferences]);

  // ローカル体験の取得
  useEffect(() => {
    if (userLocation) {
      // userLocation objectのフォーマットに合わせて適切なプロパティを使用
      const locationParams = {
        // データベースのtherapist_profiles.locationはJSONB型で
        // {"lat": -8.4095, "lng": 115.1889, "address": "..."} 形式
        lat: userLocation.lat,
        lng: userLocation.lng,
        // 必要に応じて検索範囲などの追加パラメータ
        radius: 10 // km単位の検索範囲（例）
      };

      fetchExperiences({
        where: locationParams,
        limit: 10
      }).catch(err => console.error("Error fetching experiences:", err));
    }
  }, [fetchExperiences, userLocation]);

  // ローディング状態の集約
  const isLoading = useMemo(
    () => preferencesLoading || locationLoading || experiencesLoading || therapistsLoading || eventsLoading,
    [preferencesLoading, locationLoading, experiencesLoading, therapistsLoading, eventsLoading]
  );

  // 好み設定の変換（UI表示用）
  const transformedPreferences = useMemo(() => ({
    categories: preferences?.preferred_services || [],
    languages: preferences?.preferred_languages || [],
    budget: preferences?.preferred_budget,
    gender: preferences?.gender_preference,
    amenities: preferences?.amenities_preference || {},
  }), [preferences]);

  return {
    user,
    transformedPreferences,
    userLocation,
    experiences,
    therapists,
    events,
    preferredLanguage,
    isLoading,
  };
};
