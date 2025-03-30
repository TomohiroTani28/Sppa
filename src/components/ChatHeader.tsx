// /Users/tanitomohiro/github/Sppa/src/components/ChatHeader.tsx
"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

const ChatHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          className="text-white hover:bg-blue-700"
          onClick={() => window.history.back()}
        >
          ←
        </Button>
        <h2 className="text-lg font-semibold">{t("chat.header.title", "Chat")}</h2>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-white border-white hover:bg-blue-700"
          onClick={() => alert("Settings clicked")}
        >
          {t("chat.header.settings", "Settings")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-white border-white hover:bg-blue-700"
          onClick={() => alert("More options clicked")}
        >
          ⋮
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;