// src/lib/date-utils.ts
// 日付ユーティリティ関数

import { format, addDays } from "date-fns";
import { parseISO } from "date-fns/parseISO";

// 日付をISOフォーマットの文字列に変換
export const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd HH:mm:ss");
};

// 時刻部分のみ 'HH:mm' 形式でフォーマット
export const formatTime = (date: Date | string) => {
  return format(new Date(date), "HH:mm");
};

// ISOフォーマットの日付文字列をDateオブジェクトに変換
export const parseDate = (dateString: string) => {
  return parseISO(dateString);
};

// 日付に指定した日数を追加
export const addDaysToDate = (date: Date, days: number) => {
  return addDays(date, days);
};

// 日付を指定したフォーマットでフォーマット（UI用）
export const formatDateForUI = (date: Date) => {
  return format(date, "dd MMM yyyy");
};

export default {
  formatDate,
  formatTime,
  parseDate,
  addDaysToDate,
  formatDateForUI,
};
