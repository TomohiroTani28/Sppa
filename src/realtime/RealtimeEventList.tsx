"use client";
// src/app/realtime/RealtimeEventList.tsx
import React, { useEffect } from "react";
import { gql, useSubscription } from "@apollo/client";

// Hasura の GraphQL Subscription を利用して、公開中のイベントのリアルタイム更新を受け取る
export const SUBSCRIBE_EVENTS = gql`
  subscription OnEventsUpdated {
    events(where: { is_active: { _eq: true } }) {
      id
      title
      description
      start_date
      end_date
      discount_percentage
      promotion_code
      updated_at
    }
  }
`;

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  discount_percentage?: number;
  promotion_code?: string;
  updated_at: string;
}

interface RealtimeEventListProps {
  events: Event[];
  onUpdate: () => void;
}

export const RealtimeEventList: React.FC<RealtimeEventListProps> = ({
  events,
  onUpdate,
}) => {
  const { data, error } = useSubscription(SUBSCRIBE_EVENTS);

  // サブスクリプションで新しいデータを受信した場合、onUpdate コールバックで親コンポーネントに通知
  useEffect(() => {
    if (data) {
      onUpdate();
    }
  }, [data, onUpdate]);

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">エラー: {error.message}</p>}
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold">{event.title}</h2>
            <p className="text-gray-600">{event.description}</p>
            <p className="text-sm">
              {new Date(event.start_date).toLocaleString()} ～{" "}
              {new Date(event.end_date).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">現在、公開中のイベントはありません。</p>
      )}
    </div>
  );
};
