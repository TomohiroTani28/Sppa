// src/app/(common)/feed/components/PostCard.tsx
"use client";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { Post } from "@/types/post";
import { Button } from "@/components/ui/Button";
import { TranslationToggle } from "./TranslationToggle";

// Event 型を仮定（必要に応じて実際の型をインポート）
interface Event {
  id: string;
  therapist_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  discount_percentage?: number;
  created_at: string;
  updated_at: string;
}

// New component for media
const PostMedia = ({ post, t }: { post: Post; t: (key: string) => string }) => (
  post.media && (
    <div className="relative">
      {post.media.mediaType === "video" ? (
        <video
          src={post.media.url}
          controls
          className="w-full object-cover"
          aria-label={post.content || t("videoContent")}
        >
          <track kind="captions" src="/captions.vtt" label="English" default />
        </video>
      ) : (
        <img
          src={post.media.url}
          alt={post.content || t("imageContent")}
          className="w-full object-cover"
          loading="lazy"
        />
      )}
      {post.user.role === "therapist" && (
        <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          {t("therapistBadge")}
        </span>
      )}
    </div>
  )
);

// Main component
interface PostCardProps {
  readonly post?: Post;  // オプションに変更
  readonly event?: Event;  // event を追加
  readonly currentUserId?: string;
  readonly isAvailable?: boolean;  // isAvailable を追加
}

export function PostCard({ post, event, currentUserId, isAvailable }: PostCardProps) {
  const { t } = useTranslation("common");
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedContent, setTranslatedContent] = useState(post?.content || event?.description || "");

  const handleTranslate = async () => {
    const textToTranslate = post?.content || event?.description || "";
    if (!isTranslated) {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToTranslate, targetLang: "en" }),
      });
      const data = await response.json();
      setTranslatedContent(data.translatedText);
      setIsTranslated(true);
    } else {
      setTranslatedContent(textToTranslate);
      setIsTranslated(false);
    }
  };

  const content = post ? post.content : event?.description;
  const user = post?.user;
  const role = user?.role || "therapist"; // event の場合は therapist を仮定

  return (
    <div className="rounded-lg bg-white shadow-md overflow-hidden">
      {post && <PostMedia post={post} t={t} />}
      <div className="p-2">
        <div className="flex items-center mb-2">
          {user && (
            <img
              src={user.profilePicture || "/default-avatar.png"}
              alt={user.name}
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <span className="font-semibold">{user?.name || "Therapist"}</span>
        </div>
        {content && (
          <p className="text-sm text-gray-700">{translatedContent}</p>
        )}
        <div className="flex justify-between mt-2">
          <button className="text-gray-500 hover:text-blue-500" aria-label={t("like")}>
            {t("like")}
          </button>
          <button className="text-gray-500 hover:text-blue-500" aria-label={t("comment")}>
            {t("comment")}
          </button>
          <button className="text-gray-500 hover:text-blue-500" aria-label={t("share")}>
            {t("share")}
          </button>
          {role === "therapist" && (
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = `/therapists/${post?.user.id || event?.therapist_id}/booking`;
              }}
            >
              {t(isAvailable ? "bookNow" : "unavailable")}
            </Button>
          )}
          {content && (
            <TranslationToggle
              isTranslated={isTranslated}
              onClick={handleTranslate}
            />
          )}
        </div>
      </div>
    </div>
  );
}