"use client";
// src/components/ui/Calendar.tsx
import React, { useState } from "react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { cn } from "@/lib/utils"; // Utility for className merging (common in Shadcn/UI)
import { Button } from "./Button"; // Assuming you have a Button component

interface CalendarProps {
  mode?: "single"; // Only single mode for now, extendable to "range" or "multiple" later
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  disabled?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  mode = "single",
  selected,
  onSelect,
  className,
  disabled = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState<CalendarDate>(
    selected
      ? new CalendarDate(
          selected.getFullYear(),
          selected.getMonth() + 1,
          selected.getDate(),
        )
      : today(getLocalTimeZone()),
  );

  const daysInMonth = (date: CalendarDate) => {
    const lastDay = date
      .set({ day: 1 })
      .add({ months: 1 })
      .subtract({ days: 1 });
    return lastDay.day;
  };

  const firstDayOfMonth = (date: CalendarDate) => {
    return date.set({ day: 1 }).toDate(getLocalTimeZone()).getDay();
  };

  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= totalDays; day++) {
      days.push(currentMonth.set({ day }));
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract({ months: 1 }));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add({ months: 1 }));
  };

  const handleDaySelect = (date: CalendarDate | null) => {
    if (!date || disabled) return;
    const jsDate = date.toDate(getLocalTimeZone());
    onSelect?.(jsDate);
  };

  const calendarDays = generateCalendarDays();
  const selectedCalendarDate = selected
    ? new CalendarDate(
        selected.getFullYear(),
        selected.getMonth() + 1,
        selected.getDate(),
      )
    : null;

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-lg border p-4 bg-white shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevMonth}
          disabled={disabled}
          aria-label="Previous month"
        >
          &lt;
        </Button>
        <span className="text-sm font-medium">
          {currentMonth.toString().slice(0, 7).replace("-", " ")}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextMonth}
          disabled={disabled}
          aria-label="Next month"
        >
          &gt;
        </Button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mt-2">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={index} className="h-8" />;
          }

          const isSelected =
            selectedCalendarDate &&
            date.day === selectedCalendarDate.day &&
            date.month === selectedCalendarDate.month &&
            date.year === selectedCalendarDate.year;
          const isToday =
            date.day === today(getLocalTimeZone()).day &&
            date.month === today(getLocalTimeZone()).month &&
            date.year === today(getLocalTimeZone()).year;

          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-sm",
                isSelected && "bg-blue-500 text-white",
                isToday && !isSelected && "border border-blue-300",
                !isSelected && !isToday && "hover:bg-gray-100",
                disabled && "opacity-50 cursor-not-allowed",
              )}
              onClick={() => handleDaySelect(date)}
              disabled={disabled}
            >
              {date.day}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
