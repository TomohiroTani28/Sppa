// src/@types/shadcn__ui.d.ts
declare module '@shadcn/ui' {
    import * as React from 'react';
  
    // Buttonのプロパティ例。必要に応じて調整してください。
    export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
      variant?: 'primary' | 'secondary' | 'outline';
      // 他のカスタムプロパティがあれば追加
    }
    export const Button: React.FC<ButtonProps>;
  
    // Cardのプロパティ例。必要に応じて調整してください。
    export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
      // カード固有のプロパティがあれば追加
    }
    export const Card: React.FC<CardProps>;
  }
  