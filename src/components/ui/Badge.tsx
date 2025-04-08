"use client";
// src/components/ui/Badge.tsx
import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primary text-primary-foreground hover:bg-primary/80":
            variant === "default",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80":
            variant === "secondary",
          "bg-destructive text-destructive-foreground hover:bg-destructive/80":
            variant === "destructive",
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground":
            variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export default Badge;
