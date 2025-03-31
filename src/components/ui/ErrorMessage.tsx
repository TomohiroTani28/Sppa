// src/components/ui/ErrorMessage.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ErrorMessageコンポーネントのプロパティ
 */
interface ErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** 表示するエラーメッセージ */
  message: string;
}

/**
 * エラーメッセージを表示するコンポーネント
 * @param {ErrorMessageProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} エラーメッセージのp要素
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className,
  ...props
}) => {
  return (
    <p
      className={cn("text-sm font-medium text-red-500", className)}
      role="alert"
      {...props}
    >
      {message}
    </p>
  );
};