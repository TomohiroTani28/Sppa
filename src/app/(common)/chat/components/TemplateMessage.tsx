// src/app/tourist/chat/components/TemplateMessage.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { useTranslation } from "next-i18next";

interface TemplateMessageProps {
  onSelectTemplate: (templateText: string) => void;
  onClose: () => void;
}

const TemplateMessage: React.FC<TemplateMessageProps> = ({
  onSelectTemplate,
  onClose,
}) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("greetings");

  // Define template categories and messages
  const templates = {
    greetings: [
      { id: "greeting1", text: t("Hello! How are you today?") },
      {
        id: "greeting2",
        text: t("Good morning/afternoon! Hope you are well."),
      },
      {
        id: "greeting3",
        text: t("Hi! I would like to know more about your services."),
      },
    ],
    booking: [
      { id: "booking1", text: t("I would like to book a session, please.") },
      { id: "booking2", text: t("Are you available tomorrow?") },
      { id: "booking3", text: t("Can I reschedule my appointment?") },
      {
        id: "booking4",
        text: t("What time slots do you have available this week?"),
      },
    ],
    questions: [
      { id: "question1", text: t("What types of massage do you offer?") },
      { id: "question2", text: t("How long is a typical session?") },
      {
        id: "question3",
        text: t("Do you offer any special packages or discounts?"),
      },
      {
        id: "question4",
        text: t("Can you explain what this service includes?"),
      },
    ],
    location: [
      { id: "location1", text: t("Where is your place located?") },
      {
        id: "location2",
        text: t("Can you send me directions to your location?"),
      },
      { id: "location3", text: t("Is there parking available nearby?") },
      { id: "location4", text: t("Can you come to my hotel instead?") },
    ],
    thanks: [
      { id: "thanks1", text: t("Thank you for your time!") },
      { id: "thanks2", text: t("I appreciate your help.") },
      { id: "thanks3", text: t("Thank you, looking forward to our session!") },
    ],
  };

  const categories = [
    { id: "greetings", name: t("Greetings") },
    { id: "booking", name: t("Booking") },
    { id: "questions", name: t("Questions") },
    { id: "location", name: t("Location") },
    { id: "thanks", name: t("Thanks") },
  ];

  return (
    <div className="p-3 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">{t("Template Messages")}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-2 mb-3 pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              selectedCategory === category.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {templates[selectedCategory as keyof typeof templates].map(
          (template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.text)}
              className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors text-sm border border-gray-200"
            >
              {template.text}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default TemplateMessage;
