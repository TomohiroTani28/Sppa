"use client";
import React, { createContext, useContext, ReactNode } from "react";

// 必要に応じてリアルタイム関連の状態や関数の型を定義します
interface RealtimeContextType {
  // 例: subscribe: (callback: () => void) => void;
}

// コンテキストの初期値は undefined にしておく
const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
  // ここでリアルタイム接続の初期化や状態管理を行います（例: websocket の設定など）
  const realtimeValue: RealtimeContextType = {
    // subscribe: () => { ... },
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
