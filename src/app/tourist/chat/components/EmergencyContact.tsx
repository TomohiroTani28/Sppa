// src/app/tourist/chat/components/EmergencyContact.tsx
"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Dialog } from "@/app/components/ui/Dialog";
import { useTranslation } from "next-i18next";

interface EmergencyContactProps {
  onSendEmergency: (message: string) => void;
  therapistName: string;
}

const EmergencyContact: React.FC<EmergencyContactProps> = ({
  onSendEmergency,
  therapistName,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");

  const emergencyOptions = [
    {
      id: "medical",
      label: t("Medical Emergency"),
      message: t("I have a medical emergency and need immediate assistance."),
    },
    {
      id: "safety",
      label: t("Safety Concern"),
      message: t("I have a safety concern and need your help right away."),
    },
    {
      id: "location",
      label: t("Lost/Can't Find Location"),
      message: t("I am lost and cannot find your location. Please help."),
    },
    { id: "custom", label: t("Custom Message"), message: "" },
  ];

  const handleSendEmergency = () => {
    if (emergencyType === "custom" && customMessage) {
      onSendEmergency(`🚨 URGENT: ${customMessage}`);
    } else if (emergencyType && emergencyType !== "custom") {
      const selectedOption = emergencyOptions.find(
        (option) => option.id === emergencyType,
      );
      if (selectedOption) {
        onSendEmergency(`🚨 URGENT: ${selectedOption.message}`);
      }
    }
    setOpen(false);
    setEmergencyType("");
    setCustomMessage("");
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        {t("Urgent")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">{t("Emergency Contact")}</h2>
          <div className="mb-4">
            <p className="text-red-500 font-medium mb-2">
              {t("Send an urgent message to")} {therapistName}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {t(
                "This will mark your message as urgent and notify the therapist immediately.",
              )}
            </p>

            <div className="space-y-2">
              {emergencyOptions.map((option) => (
                <div key={option.id} className="flex items-start">
                  <input
                    type="radio"
                    id={option.id}
                    name="emergencyType"
                    value={option.id}
                    checked={emergencyType === option.id}
                    onChange={() => setEmergencyType(option.id)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor={option.id} className="text-sm cursor-pointer">
                    <div className="font-medium">{option.label}</div>
                    {option.id !== "custom" && (
                      <div className="text-gray-500 text-xs mt-1">
                        {option.message}
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>

            {emergencyType === "custom" && (
              <div className="mt-3">
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  rows={3}
                  placeholder={t("Type your urgent message here...")}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setOpen(false)} variant="outline">
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleSendEmergency}
              disabled={
                !emergencyType || (emergencyType === "custom" && !customMessage)
              }
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {t("Send Urgent Message")}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default EmergencyContact;