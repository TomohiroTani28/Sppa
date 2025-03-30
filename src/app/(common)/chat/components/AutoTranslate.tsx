// src/app/(common)/chat/components/AutoTranslate.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "next-i18next";

interface AutoTranslateProps {
  text: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  onTranslated?: (translatedText: string) => void;
}

// Define supported languages
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
];

// Simple in-memory cache for translations to reduce API calls
const translationCache: Record<string, string> = {};

const AutoTranslate: React.FC<AutoTranslateProps> = ({
  text,
  sourceLanguage = "auto",
  targetLanguage: initialTargetLanguage,
  onTranslated,
}) => {
  // @ts-ignore
  const { t, i18n } = useTranslation();
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState(
    initialTargetLanguage || i18n.language || "en",
  );

  // Create a cache key
  const getCacheKey = (text: string, source: string, target: string) => {
    return `${text}|${source}|${target}`;
  };

  const translateText = async () => {
    if (!text.trim()) return;

    setIsTranslating(true);
    setError(null);

    const cacheKey = getCacheKey(text, sourceLanguage, targetLanguage);

    // Check cache first
    if (translationCache[cacheKey]) {
      setTranslatedText(translationCache[cacheKey]);
      setIsTranslated(true);
      setIsTranslating(false);
      if (onTranslated) onTranslated(translationCache[cacheKey]);
      return;
    }

    try {
      // Mock API call to Google Translate API (replace with actual implementation)
      // In real implementation, you would call a backend API endpoint
      // that proxies to Google Translate API to keep your API key secure

      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // For demonstration, just append "[Translated]" to the text
      // In a real app, you would use the translation API response
      const result = `${text} [Translated to ${LANGUAGES.find((lang) => lang.code === targetLanguage)?.name || targetLanguage}]`;

      // Store in cache
      translationCache[cacheKey] = result;

      setTranslatedText(result);
      setIsTranslated(true);
      if (onTranslated) onTranslated(result);
    } catch (err) {
      console.error("Translation error:", err);
      setError(t("Failed to translate. Please try again."));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleToggleTranslation = () => {
    if (isTranslated) {
      setIsTranslated(false);
    } else {
      translateText();
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetLanguage(e.target.value);
    setIsTranslated(false); // Reset translation state when language changes
  };

  // Auto-translate if targetLanguage changes
  useEffect(() => {
    if (text && targetLanguage !== sourceLanguage) {
      translateText();
    }
  }, [targetLanguage]);

  return (
    <div className="inline-flex flex-col">
      {error && <div className="text-xs text-red-500 mb-1">{error}</div>}

      <div className="flex items-center space-x-1 text-xs">
        <button
          onClick={handleToggleTranslation}
          disabled={isTranslating}
          className="text-blue-500 hover:text-blue-700 underline flex items-center"
        >
          {isTranslating ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-3 w-3 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("Translating...")}
            </span>
          ) : isTranslated ? (
            t("Show original")
          ) : (
            t("Translate")
          )}
        </button>

        <span className="text-gray-500">|</span>

        <select
          value={targetLanguage}
          onChange={handleLanguageChange}
          className="text-xs border-none bg-transparent text-blue-500 hover:text-blue-700 focus:ring-0 p-0 cursor-pointer"
        >
          {LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AutoTranslate;