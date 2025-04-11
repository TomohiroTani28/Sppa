import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { paymentFormSchema } from '@/lib/validations/form';
import { handleApiError } from '@/utils/error-handling';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface PaymentSectionProps {
  amount: number;
  currency: string;
  onSubmit: (data: PaymentFormData) => Promise<void>;
  isLoading: boolean;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  amount,
  currency,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
  });

  const handleFormSubmit = async (data: PaymentFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      const appError = handleApiError(error);
      console.error('Payment processing failed:', appError);
    }
  };

  // Extract error messages
  const cardNumberError = errors.cardNumber?.message;
  const expiryDateError = errors.expiryDate?.message;
  const cvvError = errors.cvv?.message;
  const nameError = errors.name?.message;

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold">
        支払い金額: {amount.toLocaleString()} {currency}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          id="cardNumber"
          label="カード番号"
          type="text"
          {...(cardNumberError && { error: cardNumberError })}
          placeholder="1234 5678 9012 3456"
          {...register('cardNumber')}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="expiryDate"
            label="有効期限"
            type="text"
            {...(expiryDateError && { error: expiryDateError })}
            placeholder="MM/YY"
            {...register('expiryDate')}
          />

          <FormField
            id="cvv"
            label="CVV"
            type="text"
            {...(cvvError && { error: cvvError })}
            placeholder="123"
            {...register('cvv')}
          />
        </div>

        <FormField
          id="name"
          label="カード名義人"
          type="text"
          {...(nameError && { error: nameError })}
          placeholder="TARO YAMADA"
          {...register('name')}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? '処理中...' : '支払いを完了する'}
        </Button>
      </form>
    </div>
  );
}; 