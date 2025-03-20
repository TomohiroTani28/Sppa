"use client";
// src/app/components/ui/Toast.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// next-i18next の useTranslation の代わりに独自の useI18n を使用
import { useI18n } from "@/app/i18n/I18nProvider";

// トーストの型定義
type ToastType = "success" | "warning" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    path?: string;
    onClick?: () => void;
  };
  translate?: boolean;
}

// コンテキストの型定義
interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ToastProvider コンポーネント
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // useI18n から翻訳関数 t を取得
  const { t } = useI18n();
  const router = useRouter();

  const addToast = (toast: Omit<Toast, "id">) => {
    // ID は Math.random を使って生成（※実際はユニークなID生成ライブラリの利用も検討）
    const id = Math.random().toString(36).substr(2, 9);
    const translatedMessage = toast.translate
      ? t(toast.message)
      : toast.message;
    setToasts((prevToasts) => [
      ...prevToasts,
      { ...toast, id, message: translatedMessage },
    ]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => {
          // ID を数値に変換して経過時間を算出（※ID生成方法によっては注意が必要）
          const elapsed = Date.now() - parseInt(toast.id, 36);
          return !toast.duration || elapsed < toast.duration;
        }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "warning"
                  ? "bg-yellow-500"
                  : toast.type === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
            } text-white`}
          >
            <span className="text-sm">{toast.message}</span>
            <div className="flex items-center gap-2">
              {toast.action && (
                <button
                  onClick={() => {
                    if (toast.action?.path) {
                      router.push(toast.action.path);
                    } else if (toast.action?.onClick) {
                      toast.action.onClick();
                    }
                    removeToast(toast.id);
                  }}
                  className="underline hover:text-gray-200"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-xl font-bold hover:text-gray-200"
                aria-label="Close toast"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// useToast フック
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// ToastExample コンポーネント（サンプル用）
export const ToastExample: React.FC = () => {
  const { addToast } = useToast();

  useEffect(() => {
    const simulateRealtimeUpdate = () => {
      addToast({
        message: "booking_confirmed",
        type: "success",
        duration: 5000,
        action: { label: "View Booking", path: "/bookings/123" },
        translate: true,
      });
    };

    const timeout = setTimeout(simulateRealtimeUpdate, 2000);
    return () => clearTimeout(timeout);
  }, [addToast]);

  return null;
};

export default ToastProvider;