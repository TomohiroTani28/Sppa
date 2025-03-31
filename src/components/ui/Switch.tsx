"use client";
// src/components/ui/Switch.tsx
import React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void; // ✅ 正しいイベントハンドラ名に変更
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(event.target.checked); // ✅ `onChange` イベントを適切に処理
    };

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          onChange={handleChange} // ✅ `onCheckedChange` の代わりに `onChange` を使用
          {...props}
        />
        <div
          className={cn(
            "w-11 h-6 bg-secondary rounded-full peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2 transition-colors",
            className,
          )}
        >
          <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5" />
        </div>
      </label>
    );
  },
);

Switch.displayName = "Switch";

export { Switch };
