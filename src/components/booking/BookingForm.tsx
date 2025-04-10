import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { bookingFormSchema } from '@/lib/validations/form';
import { handleApiError } from '@/utils/error-handling';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  therapistId: string;
  onSubmit: (data: BookingFormData) => Promise<void>;
  isLoading: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  therapistId,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
  });

  const handleFormSubmit = async (data: BookingFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      const appError = handleApiError(error);
      console.error('Booking form submission failed:', appError);
    }
  };

  // Extract error messages, ensuring they're either a string or undefined
  const dateError = errors.date?.message;
  const timeError = errors.time?.message;
  const notesError = errors.notes?.message;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormField
        id="date"
        label="予約日"
        type="date"
        {...(dateError && { error: dateError })}
        {...register('date')}
      />

      <FormField
        id="time"
        label="予約時間"
        type="time"
        {...(timeError && { error: timeError })}
        {...register('time')}
      />

      <FormField
        id="notes"
        label="備考"
        type="text"
        {...(notesError && { error: notesError })}
        helperText="特記事項があればご記入ください"
        {...register('notes')}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? '予約処理中...' : '予約する'}
      </Button>
    </form>
  );
}; 