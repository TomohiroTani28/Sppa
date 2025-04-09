// src/hooks/api/useAuth.ts
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// 認証状態の型を定義（exportを追加）
export interface AuthState {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string | null;
  } | null;
  token: string | null;
  role: string | null;
  profile_picture: string | null;
  loading: boolean;
  error: string | null;
}

// クライアントサイドで使用する認証フック
export const useAuth = () => {
  const { data: session, status } = useSession();
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchJwt = async () => {
        setIsLoadingToken(true);
        try {
          const response = await fetch("/api/auth/get-jwt");
          if (response.ok) {
            const data = await response.json();
            setJwtToken(data.token || null);
          } else {
            throw new Error(`Fetch failed: ${response.status}`);
          }
        } catch (error) {
          console.error("[useAuth] ❌ Failed to fetch JWT token:", error);
          setJwtToken(null);
        } finally {
          setIsLoadingToken(false);
        }
      };
      fetchJwt();
    } else if (status === "unauthenticated") {
      setJwtToken(null);
    }
  }, [status]);

  // 認証状態を構築
  const authState: AuthState = {
    user: session?.user
      ? {
          id: session.user.id || '',
          name: session.user.name || null,
          email: session.user.email || null,
          image: session.user.image || null,
          role: (session.user as any)?.role || null,
        }
      : null,
    token: jwtToken,
    role: (session?.user as any)?.role || null,
    profile_picture: session?.user?.image || null,
    loading: status === "loading" || isLoadingToken,
    error: status === "unauthenticated" ? "User is not authenticated" : null,
  };

  // getAuthState 関数を追加
  const getAuthState = async () => {
    return authState;
  };

  return { ...authState, getAuthState };
};

// サーバーサイド用の認証関数
export const getAuthServerSide = async () => {
  const session = await getServerSession(authOptions);
  return {
    user: session?.user
      ? {
          id: session.user.id || '',
          name: session.user.name || null,
          email: session.user.email || null,
          image: session.user.image || null,
          role: (session.user as any)?.role || null,
        }
      : null,
    token: null,
    role: (session?.user as any)?.role || null,
    profile_picture: session?.user?.image || null,
    loading: false,
  };
};
