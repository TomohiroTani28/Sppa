// src/app/tourist/profile/components/DarkModeToggle.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/app/components/ui/Switch";
import { Label } from "@/app/components/ui/Label";

interface DarkModeToggleProps {
  userId?: string;
}

/**
 * ダークモード切り替えコンポーネント
 * 観光客がライトモードとダークモードを切り替えられます。
 */
const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ userId }) => {
  const { t } = useTranslation("common");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDarkMode(storedTheme === "dark" || (!storedTheme && prefersDark));
      document.documentElement.classList.toggle("dark", isDarkMode);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", isDarkMode);
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          {isDarkMode ? (
            <Moon className="h-6 w-6 text-yellow-500" />
          ) : (
            <Sun className="h-6 w-6 text-orange-500" />
          )}
          <Label
            htmlFor="dark-mode-toggle"
            className="text-lg font-medium cursor-pointer"
          >
            {isDarkMode ? t("settings.darkMode") : t("settings.lightMode")}
          </Label>
        </div>
        <Switch
          id="dark-mode-toggle"
          checked={isDarkMode}
          onCheckedChange={toggleDarkMode}
          className="data-[state=checked]:bg-blue-600"
        />
      </div>
      <p className="text-sm text-gray-500">{t("settings.themeDescription")}</p>
    </div>
  );
};

export default DarkModeToggle;
