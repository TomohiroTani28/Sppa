"use client";
// src/components/ui/Avatar.tsx
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt: string;
  className?: string;
}

export function Avatar({ src, alt, className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full bg-gray-100",
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200">
          <span className="text-sm font-medium text-gray-500">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
} 