"use client";
// src/components/ui/Badge.tsx
import { cn } from "@/lib/utils";
import React from "react";

const badgeVariants = {
  default: "bg-primary text-white",
  secondary: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
  outline:
    "border border-gray-300 text-gray-900 dark:border-gray-600 dark:text-gray-100",
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-black",
  danger: "bg-red-500 text-white",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
