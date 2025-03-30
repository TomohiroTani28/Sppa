"use client";
// src/app/(common)/chat/hooks/useAutoTranslation.ts
import { useState, useCallback } from "react";
import { useTranslation } from "next-i18next";

/**
 * 自動翻訳を管理するカスタムフック
 */
export function useAutoTranslation() {
  const { t } = useTranslation("common");
  const [isAutoTranslateEnabled, setIsAutoTranslateEnabled] = useState(true);
  const [translationCache, setTranslationCache] = useState<Map<string, string>>(
    new Map()
  );

  const toggleAutoTranslate = useCallback(() => {
    setIsAutoTranslateEnabled((prev) => !prev);
  }, []);

  /**
   * LibreTranslateを使用してテキストを翻訳
   * @param text - 翻訳するテキスト
   * @param targetLang - ターゲット言語（例: 'en', 'id'）
   */
  const translateMessage = useCallback(
    async (text: string, targetLang: string): Promise<string | null> => {
      const cacheKey = `${text}-${targetLang}`;
      if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey) || null;
      }

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            sourceLang: "auto", // 自動検出
            targetLang,
          }),
        });

        if (!response.ok) {
          throw new Error(t("chat.translateError"));
        }

        const { translatedText } = await response.json();
        setTranslationCache((prev) => new Map(prev).set(cacheKey, translatedText));
        return translatedText;
      } catch (error) {
        console.error("Translation failed:", error);
        return null;
      }
    },
    [translationCache, t]
  );

  return {
    isAutoTranslateEnabled,
    toggleAutoTranslate,
    translateMessage,
  };
}