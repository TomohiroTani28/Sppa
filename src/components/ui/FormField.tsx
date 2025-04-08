import { cn } from '@/lib/utils';
import React from 'react';
import { Input } from './Input';
import { Label } from './Label';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, containerClassName, className, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', containerClassName)}>
        <Label htmlFor={props.id}>{label}</Label>
        <Input
          ref={ref}
          className={cn('w-full', className)}
          error={error}
          {...props}
        />
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
        {error && (
          <span className="text-red-500 text-sm">{error}</span>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField'; 