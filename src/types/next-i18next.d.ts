// src/types/next-i18next.d.ts
declare module "next-i18next" {
    export function useTranslation(namespace?: string): { t: (key: string) => string };
  }
  