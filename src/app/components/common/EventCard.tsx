// src/components/common/EventCard.tsx
import React from 'react';
import { Card, CardContent, CardTitle, CardDescription } from "../ui/Card";
import { FaCalendarAlt } from "react-icons/fa";

interface EventCardProps {
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

export default function EventCard({ title, date, description, imageUrl }: EventCardProps) {
  return (
    <Card className="w-full shadow-md">
      <div className="relative w-full h-48">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover rounded-t-md"
        />
      </div>
      <CardContent className="p-4">
        <CardTitle className="text-xl font-bold mb-2 text-text">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-muted mb-2 flex items-center">
          <FaCalendarAlt className="mr-1" /> {date}
        </CardDescription>
        <p className="text-base text-text">{description}</p>
      </CardContent>
    </Card>
  );
}