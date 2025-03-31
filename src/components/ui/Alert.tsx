"use client";
// src/components/ui/Alert.tsx
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React from "react";

const alertVariants = {
  info: "bg-blue-100 text-blue-800 border-blue-500",
  success: "bg-green-100 text-green-800 border-green-500",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-500",
  error: "bg-red-100 text-red-800 border-red-500",
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof alertVariants;
  dismissible?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  className,
  variant = "info",
  children,
  dismissible = false,
  ...props
}) => {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "flex items-center p-4 rounded-lg border transition duration-300",
        alertVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="ml-4 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

// AlertTitle コンポーネント
const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h5 className={cn("font-semibold text-lg", className)} {...props}>
    {children}
  </h5>
);

// AlertDescription コンポーネント
const AlertDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, children, ...props }) => (
  <p
    className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
    {...props}
  >
    {children}
  </p>
);

// **全てをエクスポート**
export { Alert, AlertTitle, AlertDescription };
