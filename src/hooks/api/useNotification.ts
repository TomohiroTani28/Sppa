// src/hooks/api/useNotification.ts
import { useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

// Toast のオプション型を定義（Shadcn/UI の想定仕様に基づく）
interface ToastOptions {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

// Toast 関数型を定義
type ToastFunction = (options: ToastOptions) => void;

/**
 * 通知タイプ
 */
export type NotificationType = 'success' | 'error' | 'info';

/**
 * 通知を表示するためのカスタムフック
 * @returns notify 関数を含むオブジェクト
 */
export const useNotification = () => {
  const toast = useToast() as unknown as ToastFunction; // unknown を経由して安全にキャスト

  const notify = useCallback(
    (message: string, type: NotificationType = 'info') => {
      let title: string;
      switch (type) {
        case 'success':
          title = 'Success';
          break;
        case 'error':
          title = 'Error';
          break;
        default:
          title = 'Info';
      }

      toast({
        title,
        description: message,
        variant: type === 'error' ? 'destructive' : 'default',
        duration: 3000,
      });
    },
    [toast]
  );

  return { notify };
};