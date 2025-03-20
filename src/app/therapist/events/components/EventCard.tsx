// src/app/therapist/events/components/EventCard.tsx
import { FaCalendarAlt } from "react-icons/fa";
import { Card } from "@/app/components/ui/Card"; // パスはプロジェクト構造に合わせてください
import { Event } from "@/types/event"; // Event 型をインポート

// EventCardProps は event オブジェクトを受け取るように変更
interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  // 必要に応じて event のプロパティ名を合わせます。ここでは、startDate を date として扱います
  const { title, startDate: date, description, imageUrl } = event;
  return (
    <Card className="w-full shadow-md">
      <div className="relative w-full h-48">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-sm text-gray-500">
          <FaCalendarAlt className="inline mr-1" /> {date}
        </p>
      </div>
    </Card>
  );
}
