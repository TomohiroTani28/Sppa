"use client";
// src/app/components/ui/DatePicker.tsx
import React from "react";

export interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    onChange(newDate);
  };

  // 入力用に YYYY-MM-DD 形式に変換
  const formattedValue = value.toISOString().substring(0, 10);

  return (
    <input
      type="date"
      value={formattedValue}
      onChange={handleChange}
      className={`border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
      {...props}
    />
  );
};

export default DatePicker;
