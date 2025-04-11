type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  context?: string;
  data?: any;
  timestamp?: boolean;
}

// 現在のログレベル（環境変数から、デフォルトは 'info'）
const currentLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

// ログレベルの優先順位
const logLevelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// タイムスタンプの生成
const getTimestamp = (): string => {
  return new Date().toISOString();
};

// ログを出力するかどうかの判定
const shouldLog = (level: LogLevel): boolean => {
  return logLevelPriority[level] >= logLevelPriority[currentLogLevel];
};

// スタイル付きコンソールログ用の色定義
const logColors = {
  debug: '#7f8c8d', // グレー
  info: '#2ecc71',  // グリーン
  warn: '#f39c12',  // オレンジ
  error: '#e74c3c', // レッド
};

// 基本ロガー関数
const logger = (level: LogLevel, message: string, options: LogOptions = {}) => {
  if (!shouldLog(level)) return;

  const { context, data, timestamp = true } = options;
  
  const parts = [
    timestamp ? `[${getTimestamp()}]` : '',
    level.toUpperCase(),
    context ? `[${context}]` : '',
    message,
  ].filter(Boolean);
  
  const logMessage = parts.join(' ');

  // ブラウザ環境ではスタイル付きログ、それ以外では通常のログ
  if (typeof window !== 'undefined') {
    console.log(`%c${logMessage}`, `color: ${logColors[level]}`);
    if (data) console.log(data);
  } else {
    if (data) {
      console[level](logMessage, data);
    } else {
      console[level](logMessage);
    }
  }
};

// エクスポートする各ログレベル関数
export const debug = (message: string, options?: LogOptions) => 
  logger('debug', message, options);

export const info = (message: string, options?: LogOptions) => 
  logger('info', message, options);

export const warn = (message: string, options?: LogOptions) => 
  logger('warn', message, options);

export const error = (message: string, options?: LogOptions) => 
  logger('error', message, options);

// デフォルトエクスポート
export default {
  debug,
  info,
  warn,
  error,
}; 