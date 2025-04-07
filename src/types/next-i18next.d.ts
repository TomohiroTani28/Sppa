// src/types/next-i18next.d.ts
declare module "next-i18next" {
  import { i18n } from 'i18next';
  
  export function useTranslation(namespace?: string): { 
    t: (key: string, options?: any) => string;
    i18n: i18n;
  };
}
  