/*src/app/lib/string-utils.ts
/**
 * 文字列を大文字に変換するユーティリティ関数
 * @param str 変換する文字列
 * @returns 大文字に変換された文字列
 */
export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

/**
 * 文字列を小文字に変換するユーティリティ関数
 * @param str 変換する文字列
 * @returns 小文字に変換された文字列
 */
export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

/**
 * 文字列の先頭と末尾の空白を取り除くユーティリティ関数
 * @param str 空白を取り除く文字列
 * @returns 空白を取り除いた文字列
 */
export function trimString(str: string): string {
  return str.trim();
}

/**
 * 文字列が空でないかをチェックするユーティリティ関数
 * @param str チェックする文字列
 * @returns 空でない場合は true、それ以外は false
 */
export function isNonEmptyString(str: string): boolean {
  return str.trim().length > 0;
}

/**
 * 文字列が指定した長さ以上かどうかをチェックするユーティリティ関数
 * @param str チェックする文字列
 * @param length 最小長さ
 * @returns 最小長さ以上の場合は true、それ以外は false
 */
export function isStringLengthAtLeast(str: string, length: number): boolean {
  return str.length >= length;
}
