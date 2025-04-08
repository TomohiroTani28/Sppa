"use client";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

// リアルタイム関連の状態や関数の型を定義
interface RealtimeContextType {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
  reconnect: () => void;
}

// コンテキストの初期値を空のオブジェクトに設定
const RealtimeContext = createContext<RealtimeContextType>({
  isConnected: false,
  connectionStatus: 'disconnected',
  error: null,
  reconnect: () => {},
});

export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);

  // 接続状態を監視する関数
  const reconnect = () => {
    setConnectionStatus('connecting');
    // 実際の再接続ロジックはここに実装
    // 例: WebSocketの再接続など
    setTimeout(() => {
      setConnectionStatus('connected');
      setIsConnected(true);
      setError(null);
    }, 1000);
  };

  // 初期接続を試みる
  useEffect(() => {
    reconnect();
  }, []);

  const realtimeValue: RealtimeContextType = {
    isConnected,
    connectionStatus,
    error,
    reconnect,
  };

  return (
    <RealtimeContext.Provider value={realtimeValue}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtimeContext = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error("useRealtimeContext must be used within a RealtimeProvider");
  }
  return context;
};
