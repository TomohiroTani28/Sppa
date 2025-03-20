// src/app/(common)/home/components/TabSelector.tsx
"use client";
import { useTranslation } from "next-i18next";
import { UserIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

interface TabSelectorProps {
  readonly selectedTab: "tourist" | "therapist";
  readonly setSelectedTab: (tab: "tourist" | "therapist") => void;
}

export function TabSelector({ selectedTab, setSelectedTab }: TabSelectorProps) {
  const { t } = useTranslation("common");

  return (
    <div className="flex justify-center space-x-4 py-2 bg-gray">
      <button
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
          selectedTab === "tourist" ? "bg-primary text-white" : "bg-white text-muted"
        }`}
        onClick={() => setSelectedTab("tourist")}
        aria-label={t("tourist")}
      >
        <UserIcon className="w-5 h-5" />
        <span>{t("tourist")}</span>
      </button>
      <button
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
          selectedTab === "therapist" ? "bg-primary text-white" : "bg-white text-muted"
        }`}
        onClick={() => setSelectedTab("therapist")}
        aria-label={t("therapist")}
      >
        <BriefcaseIcon className="w-5 h-5" />
        <span>{t("therapist")}</span>
      </button>
    </div>
  );
}