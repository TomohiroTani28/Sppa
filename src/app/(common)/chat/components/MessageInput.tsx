"use client";
// src/app/(common)/chat/components/MessageInput.tsx
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/api/useAuth";
import { gql, useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import { useAutoTranslation } from "../../../../hooks/useAutoTranslation";

// 認証状態の型を定義
interface AuthState {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role?: string } | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

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

export default function MessageInput({ receiverId }: MessageInputProps) {
  const { t } = useTranslation("common");
  const { getAuthState } = useAuth(); // getAuthState を使用
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { isAutoTranslateEnabled, translateMessage } = useAutoTranslation();
  const [message, setMessage] = useState("");
  const [sendMessage, { loading, error }] = useMutation(SEND_MESSAGE);

  // 認証状態を非同期で取得
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const state = await getAuthState();
        setAuthState(state);
      } catch (error) {
        console.error("Failed to fetch auth state:", error);
        setAuthState(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    fetchAuthState();
  }, [getAuthState]);

  const handleSend = async () => {
    if (!message.trim() || !authState?.user) return;

    let translatedContent = null;
    if (isAutoTranslateEnabled) {
      translatedContent = await translateMessage(message, "en");
    }

    try {
      await sendMessage({
        variables: {
          sender_id: authState.user.id, // authState.user を使用
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

  // 認証状態のローディング中は入力欄を無効化
  if (isLoadingAuth) {
    return (
      <div className="p-4 border-t border-gray-200">
        <p className="text-gray-500 text-center">{t("loading")}</p>
      </div>
    );
  }

  // ユーザーが未認証の場合
  if (!authState?.user) {
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
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
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