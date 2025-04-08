// src/lib/token.ts
import jwt from "jsonwebtoken";

/**
 * JWT形式のIDトークンを検証してデコードされたペイロードを返す
 * @param token JWT IDトークン
 * @returns トークンが有効な場合はデコードされた情報、無効な場合はnull
 */
export function verifyIdToken(token: string): Record<string, any> | null {
  try {
    const secret = process.env['JWT_SECRET'];
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, secret);
    return typeof decoded === "string" ? { sub: decoded } : decoded;
  } catch (err) {
    console.error("❌ Failed to verify ID token:", err);
    return null;
  }
}
