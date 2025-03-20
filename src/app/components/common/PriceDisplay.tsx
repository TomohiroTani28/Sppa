// src/app/components/common/PriceDisplay.tsx
import React from 'react';
import { cn } from '@/app/lib/utils';
import { useTranslation } from 'next-i18next';

interface PriceDisplayProps {
  amount?: number;
  price?: number;
  currency?: string;
  size?: 'small' | 'medium' | 'large';
  showCurrencySymbol?: boolean;
  showCurrencyCode?: boolean;
  className?: string;
  discountPercentage?: number;
  originalAmount?: number;
  showDiscount?: boolean;
}

/**
 * PriceDisplay component - Shows prices with proper currency formatting
 * 
 * @param amount - The price amount to display (alternative to price)
 * @param price - The price amount to display (alternative to amount)
 * @param currency - Currency code (IDR, USD, etc.)
 * @param size - Display size variant
 * @param showCurrencySymbol - Whether to show the currency symbol
 * @param showCurrencyCode - Whether to show the currency code
 * @param className - Additional CSS classes
 * @param discountPercentage - Discount percentage if applicable
 * @param originalAmount - Original amount before discount
 * @param showDiscount - Whether to show discount information
 */
export function PriceDisplay({
  amount,
  price,
  currency = 'IDR',
  size = 'medium',
  showCurrencySymbol = true,
  showCurrencyCode = false,
  className = '',
  discountPercentage,
  originalAmount,
  showDiscount = false,
}: PriceDisplayProps) {
  const { i18n } = useTranslation();
  
  // Prioritize price if both amount and price are provided
  const displayAmount = price ?? amount;

  // Throw an error if no amount is provided
  if (displayAmount === undefined) {
    throw new Error('Either amount or price must be provided to PriceDisplay');
  }
  
  // Get current locale from i18n
  const locale = i18n.language || 'en';
  
  // Currency symbols mapping
  const currencySymbols: Record<string, string> = {
    IDR: 'Rp',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    SGD: 'S$',
  };

  // Format based on locale and currency
  const formattedAmount = new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayAmount);

  // Format original amount if provided
  const formattedOriginalAmount = originalAmount
    ? new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(originalAmount)
    : null;

  // Size-based styles
  const sizeStyles = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl font-semibold',
  };

  // Get currency symbol
  const symbol = currencySymbols[currency] || currency;

  return (
    <div className={cn('flex flex-col', className)}>
      <div className={cn('flex items-baseline', sizeStyles[size])}>
        {showCurrencySymbol && (
          <span className="mr-1 text-gray-600">{symbol}</span>
        )}
        <span className="font-medium">{formattedAmount}</span>
        {showCurrencyCode && (
          <span className="ml-1 text-gray-500 text-sm">{currency}</span>
        )}
      </div>
      
      {showDiscount && originalAmount && originalAmount > displayAmount && (
        <div className="flex items-center mt-1">
          <span className="line-through text-gray-400 text-sm mr-2">
            {showCurrencySymbol && symbol}{formattedOriginalAmount}
          </span>
          {discountPercentage && (
            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
              {Math.round(discountPercentage)}% {i18n.t('common:off')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}