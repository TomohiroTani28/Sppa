import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';

interface InternationalizationOptions {
  namespace?: string;
  fallback?: string;
}

export const useInternationalization = (options: InternationalizationOptions = {}) => {
  const { namespace = 'common', fallback = '' } = options;
  const { t: translate, i18n } = useTranslation(namespace);

  const t = useCallback((key: string, params?: Record<string, any>) => {
    const translation = translate(key, params);
    return translation === key ? fallback : translation;
  }, [translate, fallback]);

  const formatDate = useCallback((date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(i18n.language, options);
  }, [i18n.language]);

  const formatTime = useCallback((date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString(i18n.language, options);
  }, [i18n.language]);

  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    return number.toLocaleString(i18n.language, options);
  }, [i18n.language]);

  const formatCurrency = useCallback((amount: number, currency: string) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
    }).format(amount);
  }, [i18n.language]);

  const getLanguageName = useCallback((code: string) => {
    return new Intl.DisplayNames([i18n.language], { type: 'language' }).of(code) ?? code;
  }, [i18n.language]);

  return {
    t,
    formatDate,
    formatTime,
    formatNumber,
    formatCurrency,
    getLanguageName,
    currentLanguage: i18n.language,
    changeLanguage: i18n.changeLanguage,
    languages: i18n.languages,
  };
}; 