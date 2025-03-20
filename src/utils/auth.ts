// src/utils/auth.ts
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

// 認証トークンのキー
const AUTH_TOKEN_KEY = 'sppa_auth_token';

// トークンのデコード結果の型定義
interface DecodedToken {
  id: string;  // ユーザーID
  role: 'therapist' | 'tourist' | 'admin';  // ユーザーのロール
  'x-hasura-user-id': string;
  'x-hasura-default-role': 'therapist' | 'tourist' | 'admin';
  'x-hasura-allowed-roles': string[];
  exp: number;
}

// 共通関数：サーバーサイドで cookies() を取得
const getCookies = async () => {
  try {
    return await cookies();
  } catch (error) {
    console.error('Failed to access cookies:', error);
    return null;
  }
};

// トークンを取得する関数
export const getAuthToken = async (): Promise<string | null> => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } else {
    const cookieStore = await getCookies();
    return cookieStore?.get(AUTH_TOKEN_KEY)?.value || null;
  }
};

// トークンを保存する関数
export const setAuthToken = async (token: string): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    const cookieStore = await getCookies();
    cookieStore?.set(AUTH_TOKEN_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1週間
    });
  }
};

// トークンを削除する関数
export const removeAuthToken = async (): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } else {
    const cookieStore = await getCookies();
    cookieStore?.delete(AUTH_TOKEN_KEY);
  }
};

// デコード関数（共通化）
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      ...decoded,
      id: decoded['x-hasura-user-id'],
      role: decoded['x-hasura-default-role'],
    };
  } catch (error) {
    console.error('Token decoding error:', error);
    return null;
  }
};

// 認証チェック
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  return decoded.exp > Math.floor(Date.now() / 1000);
};

// ユーザーロール取得
export const getUserRole = async (): Promise<'therapist' | 'tourist' | 'admin' | null> => {
  const token = await getAuthToken();
  if (!token) return null;

  return decodeToken(token)?.role || null;
};

// ロール制限
export const requireRole = async (requiredRole: 'therapist' | 'tourist' | 'admin'): Promise<void> => {
  const role = await getUserRole();
  if (!role || role !== requiredRole) {
    throw new Error(`Access denied: ${requiredRole} role required`);
  }
};

// ログイン処理
export const login = async (email: string, password: string): Promise<void> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Login failed');
  const { token } = await response.json();
  await setAuthToken(token);
};

// ログアウト処理
export const logout = async (): Promise<void> => {
  await removeAuthToken();
};

// トークン検証
export const verifyToken = async (token: string): Promise<DecodedToken | null> => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  if (decoded.exp < Math.floor(Date.now() / 1000)) {
    console.error('Token has expired');
    return null;
  }

  return decoded;
};