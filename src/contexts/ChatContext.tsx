// src/contexts/ChatContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

interface ChatContextType {
  messages: string[];
  setMessages: React.Dispatch<React.SetStateAction<string[]>>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const { t } = useTranslation();

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};