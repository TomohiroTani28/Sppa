/**
 * 通貨のフォーマットを行うユーティリティ関数
 * @param amount 数値または文字列の金額
 * @param currency 通貨単位（例: 'USD', 'IDR'）
 * @param locale フォーマットに使用するロケール（例: 'en-US', 'ja-JP'）
 * @returns フォーマットされた通貨の文字列
 */
export function formatCurrency(
  amount: number | string,
  currency: string,
  locale: string = "en-US",
): string {
  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * 通貨を計算するユーティリティ関数
 * @param amount 金額
 * @param percentage 割引または手数料のパーセンテージ
 * @returns 計算後の金額
 */
export function calculateCurrency(amount: number, percentage: number): number {
  return amount * (1 + percentage / 100);
}

/**
 * 通貨の単位を切り替えるユーティリティ関数
 * @param amount 金額
 * @param exchangeRate 通貨換算レート
 * @returns 換算後の金額
 */
export function convertCurrency(amount: number, exchangeRate: number): number {
  return amount * exchangeRate;
}
