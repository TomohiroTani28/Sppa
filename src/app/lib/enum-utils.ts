/**
 * src/app/lib/enum-utils.ts
 *
 * Sppa プロジェクトで利用する ENUM 定義およびユーティリティ関数。
 *
 * PostgreSQL マイグレーションで定義された ENUM 型と対応しています。
 *
 * ENUM Types:
 * - user_role: 'therapist', 'tourist'
 * - booking_status: 'pending', 'confirmed', 'canceled', 'completed'
 * - media_type_enum: 'photo', 'video'
 * - payment_status_enum: 'pending', 'completed', 'failed'
 * - notification_type_enum: 'like', 'match', 'booking_update', 'review', 'payment', 'promotion', 'chat'
 * - therapist_status_enum: 'online', 'offline', 'busy', 'vacation'
 * - payment_method_enum: 'credit_card', 'paypal', 'stripe', 'cash', 'other'
 * - review_type_enum: 'service', 'general'
 */

export enum UserRole {
  Therapist = "therapist",
  Tourist = "tourist",
}

export enum BookingStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Canceled = "canceled",
  Completed = "completed",
}

export enum MediaType {
  Photo = "photo",
  Video = "video",
}

export enum PaymentStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
}

export enum NotificationType {
  Like = "like",
  Match = "match",
  BookingUpdate = "booking_update",
  Review = "review",
  Payment = "payment",
  Promotion = "promotion",
  Chat = "chat",
}

export enum TherapistStatus {
  Online = "online",
  Offline = "offline",
  Busy = "busy",
  Vacation = "vacation",
}

export enum PaymentMethod {
  CreditCard = "credit_card",
  Paypal = "paypal",
  Stripe = "stripe",
  Cash = "cash",
  Other = "other",
}

export enum ReviewType {
  Service = "service",
  General = "general",
}

/**
 * 指定した enum オブジェクトの全ての値を配列として取得します。
 *
 * @param enumObj - 対象の enum オブジェクト
 * @returns enum の値の配列
 */
export function getEnumValues<T extends { [key: string]: any }>(enumObj: T): Array<T[keyof T]> {
  return Object.values(enumObj);
}

/**
 * value が指定した enum の有効な値かどうかを判定します。
 *
 * @param value - チェック対象の値
 * @param enumObj - 判定対象の enum オブジェクト
 * @returns 有効な値であれば true、そうでなければ false
 */
export function isValidEnumValue<T extends { [key: string]: any }>(
  value: any,
  enumObj: T,
): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}

/**
 * 文字列から指定した enum の値へパースを試みます。
 * 有効な enum の値であればその値を、無効な場合は undefined を返します。
 *
 * @param value - パース対象の文字列
 * @param enumObj - 対象の enum オブジェクト
 * @returns パースされた enum の値、または undefined
 */
export function parseEnumValue<T extends { [key: string]: any }>(
  value: string,
  enumObj: T,
): T[keyof T] | undefined {
  const values = Object.values(enumObj) as string[];
  return values.includes(value) ? (value as T[keyof T]) : undefined;
}