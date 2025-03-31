"use client";
// src/components/LanguageSwitcher.tsx
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { languages } from "@/i18n/settings";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isLoading = isPending || loading;

  const handleLanguageChange = (newLang: string) => {
    setLoading(true);

    // Create/update cookie
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;

    // Change language in i18next
    i18n.changeLanguage(newLang);

    // Refresh page
    startTransition(() => {
      router.refresh();
      setLoading(false);
    });
  };

  return (
    <div className="flex gap-2">
      {languages.map((lng) => (
        <button
          key={lng}
          onClick={() => handleLanguageChange(lng)}
          className={`px-3 py-1 rounded ${i18n.language === lng ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          disabled={isLoading}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
