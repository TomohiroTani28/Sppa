"use client";
// src/app/components/common/BookingButton.tsx
import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar as ReactCalendar, CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTranslation } from 'next-i18next';

interface BookingButtonProps {
  therapistId: string;
  serviceId?: string;
  serviceName?: string;
  price?: number;
  currency?: string;
  duration?: number;
  className?: string;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
}

export const BookingButton: React.FC<BookingButtonProps> = ({
  therapistId,
  serviceId,
  serviceName,
  price,
  currency,
  duration = 60,
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
}) => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setNotes('');
    }
  };

  // handleDateSelect の型を CalendarProps['onChange'] に合わせ、要素が null でないかチェックする
  const handleDateSelect: CalendarProps['onChange'] = (value, event) => {
    if (value === null) {
      setSelectedDate(undefined);
    } else if (Array.isArray(value)) {
      // 複数選択の場合、最初の日付を使用
      const date = value[0];
      if (date !== null && date >= minDate) {
        setSelectedDate(date);
      }
    } else {
      // value は Date 型
      if (value >= minDate) {
        setSelectedDate(value);
      }
    }
  };

  const handleBook = async () => {
    setIsLoading(true);
    console.log('Booking confirmed:', { therapistId, selectedDate, selectedTime, notes });
    setIsLoading(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          className={`${className} ${
            variant === 'outline'
              ? 'border border-gray-300'
              : 'bg-blue-500 text-white'
          }`}
          disabled={disabled}
        >
          {t('book_now')}
        </button>
      </Dialog.Trigger>

      <Dialog.Content className="max-w-md">
        <div className="dialog-header">
          <Dialog.Title>{t('book_appointment')}</Dialog.Title>
        </div>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('select_date')}</label>
            <ReactCalendar
              onChange={handleDateSelect}
              value={selectedDate}
              minDate={minDate}
              className="rounded-md border"
            />
          </div>
        </div>

        <div className="dialog-footer">
          <button
            className="border border-gray-300"
            onClick={() => setOpen(false)}
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleBook}
            disabled={isLoading || !selectedDate || !selectedTime}
          >
            {isLoading ? t('booking') : t('confirm_booking')}
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default BookingButton;
