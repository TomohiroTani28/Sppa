// src/app/(common)/feed/components/TranslationToggle.tsx
"use client";
import { useTranslation } from "next-i18next";
import { Button } from "@/components/ui/Button";

interface TranslationToggleProps {
  isTranslated: boolean;
  onClick: () => void;
}

export function TranslationToggle({ isTranslated, onClick }: TranslationToggleProps) {
  const { t } = useTranslation("common");

  return (
    <Button variant="ghost" onClick={onClick}>
      {isTranslated ? t("original") : t("translate")}
    </Button>
  );
}