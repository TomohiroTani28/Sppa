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
} as const;

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof alertVariants | undefined;
  dismissible?: boolean | undefined;
  children: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", children, dismissible = false, ...props }, ref) => {
    const [visible, setVisible] = React.useState(true);

    if (!visible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center p-4 rounded-lg border transition duration-300",
          alertVariants[variant],
          className
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
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h5 ref={ref} className={cn("font-semibold text-lg", className)} {...props}>
    {children}
  </h5>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
    {...props}
  >
    {children}
  </p>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };