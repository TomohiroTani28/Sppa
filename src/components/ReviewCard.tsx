"use client";
// src/components/ReviewCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import Avatar from "@/components/Avatar";
import { FaStar } from "react-icons/fa";

// reviewオブジェクトの型を定義
interface Review {
  profile_picture: string;
  guest_name: string;
  rating: number;
  comment: string;
}

// プロップに型を指定
export default function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex items-center space-x-4">
        <Avatar
          imageUrl={review.profile_picture}
          alt={review.guest_name}
          size="sm"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <CardTitle className="text-lg font-semibold text-text">
            {review.guest_name}
          </CardTitle>
          <CardDescription className="text-sm text-muted flex items-center">
            <FaStar className="mr-1 text-yellow-500" /> {review.rating} stars
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-base text-text">{review.comment}</p>
      </CardContent>
    </Card>
  );
}