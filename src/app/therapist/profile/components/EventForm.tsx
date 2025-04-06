// src/app/therapist/profile/components/EventForm.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useCreateEvent } from "@/hooks/api/useCreateEvent";
import { Event } from "@/types/event";
import { useAuth } from "@/hooks/api/useAuth";

// 認証状態の型を定義
interface AuthState {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

const EventForm: React.FC = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const { createEvent, loading, error } = useCreateEvent();
  const { getAuthState } = useAuth(); // getAuthState を使用
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = [eventTitle, eventDescription, eventStartDate, eventEndDate, authState?.user?.id].every(Boolean);
    if (!isValid) return;

    const eventData: Event = {
      id: "", // バックエンドで生成される想定
      therapistId: authState!.user!.id, // 認証済みユーザーの ID を使用
      title: eventTitle,
      description: eventDescription,
      startDate: eventStartDate,
      endDate: eventEndDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: "", // 初期値として空文字を設定
    };

    await createEvent(eventData);
  };

  // 認証状態のローディング中
  if (isLoadingAuth) {
    return <div>認証情報を取得中...</div>;
  }

  // ユーザーが未認証の場合
  if (!authState?.user) {
    return <div>イベントを作成するにはログインしてください。</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">イベント登録</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm">
            イベントタイトル
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm">
            イベント詳細
          </label>
          <textarea
            id="description"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm">
            開始日付
          </label>
          <input
            type="date"
            id="startDate"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={eventStartDate}
            onChange={(e) => setEventStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm">
            終了日付
          </label>
          <input
            type="date"
            id="endDate"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "登録中..." : "登録"}
        </button>
      </form>
      {error && <div className="text-red-500 text-sm">{error.message}</div>}
    </div>
  );
};

export default EventForm;