"use client";
// src/components/ui/Text.tsx
import React from "react";
import { cn } from "@/lib/utils";

export interface TextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "body" | "title" | "subtitle";
  tag?: "p" | "h1" | "h2" | "span" | "div" | "main" | "header" | "nav";
}

const Text: React.FC<TextProps> = ({
  children,
  className,
  variant = "body",
  tag = "div",
}) => {
  const variantClasses = {
    title: "text-2xl font-bold",
    subtitle: "text-lg font-semibold",
    body: "text-base",
  };

  const Tag = tag as keyof JSX.IntrinsicElements;
  return <Tag className={cn(variantClasses[variant], className)}>{children}</Tag>;
};

export default Text;