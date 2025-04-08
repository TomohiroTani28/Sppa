"use client";
// src/components/ui/Checkbox.tsx
import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean | undefined;
  onCheckedChange?: ((checked: boolean) => void) | undefined;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked = false, onCheckedChange, className, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center", className)}>
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="absolute opacity-0 w-0 h-0"
          {...props}
        />
        <div
          className={cn(
            "h-5 w-5 flex items-center justify-center rounded border border-gray-300 bg-white shadow-sm transition-all",
            checked && "bg-primary border-primary"
          )}
        >
          {checked && <Check className="h-4 w-4 text-white" />}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
