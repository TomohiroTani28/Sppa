// src/app/tourist/chat/components/MessageInput.tsx
"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import TemplateMessage from "./TemplateMessage";
import MediaShare from "./MediaShare";
import { useTranslation } from "next-i18next";

interface MessageInputProps {
  onSendMessage: (text: string, mediaUrl?: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectTemplate = (templateText: string) => {
    setMessage(templateText);
    setIsTemplateOpen(false);
    inputRef.current?.focus();
  };

  const handleMediaSend = (mediaUrl: string) => {
    onSendMessage(message.trim(), mediaUrl);
    setMessage("");
    setIsMediaOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="mt-4 relative">
      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex space-x-1 px-2">
          <button
            onClick={() => setIsTemplateOpen(!isTemplateOpen)}
            className="text-gray-500 hover:text-blue-500 p-2 rounded-full transition-colors"
            title={t("Template Messages")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsMediaOpen(!isMediaOpen)}
            className="text-gray-500 hover:text-blue-500 p-2 rounded-full transition-colors"
            title={t("Share Media")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        <Input
          type="text"
          ref={inputRef}
          placeholder={t("Type a message...")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 py-3 border-none focus:ring-0"
        />

        <Button
          onClick={handleSendMessage}
          disabled={message.trim() === ""}
          className="m-1 px-3 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </Button>
      </div>

      {isTemplateOpen && (
        <div className="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-lg z-10">
          <TemplateMessage
            onSelectTemplate={handleSelectTemplate}
            onClose={() => setIsTemplateOpen(false)}
          />
        </div>
      )}

      {isMediaOpen && (
        <div className="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-lg z-10">
          <MediaShare
            onUploadComplete={handleMediaSend}
            onClose={() => setIsMediaOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
