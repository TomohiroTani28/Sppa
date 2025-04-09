"use client";
// src/app/(common)/chat/components/MessageInput.tsx
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/api/useAuth";
import { gql, useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { useAutoTranslation } from "@/hooks/useAutoTranslation";
import { useState } from "react";

const SEND_MESSAGE = gql`
  mutation SendMessage($sender_id: UUID!, $receiver_id: UUID!, $content: String!, $translated_content: jsonb) {
    insert_realtime_messages_one(object: {
      sender_id: $sender_id,
      receiver_id: $receiver_id,
      content: $content,
      translated_content: $translated_content
    }) {
      id
      sender_id
      receiver_id
      content
      translated_content
      sent_at
    }
  }
`;

interface MessageInputProps {
  receiverId: string;
}

export default function MessageInput({ receiverId }: Readonly<MessageInputProps>) {
  const { t } = useTranslation("common");
  const { session, status } = useAuth(); // Fix: Correctly destructure properties from useAuth
  const { isAutoTranslateEnabled, translateMessage } = useAutoTranslation();
  const [message, setMessage] = useState("");
  const [sendMessage, { loading, error }] = useMutation(SEND_MESSAGE);

  const isLoadingAuth = status === "loading"; // Fix: Determine loading state from status
  const user = session?.user; // Fix: Get user from session

  const handleSend = async () => {
    if (!message.trim() || !user) return;

    let translatedContent = null;
    if (isAutoTranslateEnabled) {
      translatedContent = await translateMessage(message, "en");
    }

    try {
      await sendMessage({
        variables: {
          sender_id: user.id,
          receiver_id: receiverId,
          content: message,
          translated_content: translatedContent ? { en: translatedContent } : null,
        },
      });
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="p-4 border-t border-gray-200">
        <p className="text-gray-500 text-center">{t("loading")}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 border-t border-gray-200">
        <p className="text-gray-500 text-center">{t("auth.required")}</p>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200">
      {error && <p className="text-red-500 text-sm mb-2">{t("chat.sendError")}</p>}
      <div className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("chat.typeMessage")}
          className="flex-1"
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="bg-blue-500 text-white"
        >
          {loading ? t("chat.sending") : t("chat.send")}
        </Button>
      </div>
    </div>
  );
}