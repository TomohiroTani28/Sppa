// src/utils/auth.ts
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

// クライアント用に localStorage キー定義
const AUTH_TOKEN_KEY = 'sppa_auth_token';

export type UserRole = 'therapist' | 'tourist' | 'admin';

export interface DecodedToken {
  id: string;
  role: UserRole;
  'x-hasura-user-id': string;
  'x-hasura-default-role': UserRole;
  'x-hasura-allowed-roles': string[];
  exp: number;
}

// ----------------------------
// 共通ユーティリティ
// ----------------------------

// サーバーでトークンを取得
export const getServerAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_KEY)?.value ?? null;
};

// クライアント or サーバーでトークンを取得
export const getAuthToken = async (): Promise<string | null> => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return await getServerAuthToken();
};

// JWT をデコードして安全に型変換
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      ...decoded,
      id: decoded['x-hasura-user-id'],
      role: decoded['x-hasura-default-role'],
    };
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
};

// 認証されているかどうか
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  return decoded.exp > Math.floor(Date.now() / 1000);
};

// 現在のユーザーロールを取得
export const getUserRole = async (): Promise<UserRole | null> => {
  const token = await getAuthToken();
  if (!token) return null;

  return decodeToken(token)?.role ?? null;
};

// 特定のロールを持っているかを確認
export const requireRole = async (requiredRole: UserRole): Promise<void> => {
  const role = await getUserRole();
  if (!role || role !== requiredRole) {
    throw new Error(`Access denied: ${requiredRole} role required`);
  }
};

// トークンの有効性を検証
export const verifyToken = async (token: string): Promise<DecodedToken | null> => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  if (decoded.exp < Math.floor(Date.now() / 1000)) {
    console.warn('Token expired');
    return null;
  }

  return decoded;
};

// ----------------------------
// クライアント専用：API経由でログイン・ログアウト
// ----------------------------

// ログイン処理（APIでトークンを取得し localStorage に保存）
export const login = async (email: string, password: string): Promise<void> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Login failed');

  const { token } = await res.json();
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

// ログアウト処理（localStorage 削除 + サーバーAPI通知）
export const logout = async (): Promise<void> => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  await fetch('/api/auth/logout', { method: 'POST' });
};
