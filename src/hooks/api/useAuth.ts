// src/hooks/api/useAuth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // NextAuth の設定をインポート
import { useState, useEffect } from "react";

// クライアントサイドでのみ動作する場合
export const useAuth = () => {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);

  useEffect(() => {
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
  }, []);

  // サーバーサイドでセッションを取得する場合（非同期呼び出し）
  const getAuthState = async () => {
    const session = await getServerSession(authOptions);
    return {
      user: session?.user || null,
      token: jwtToken,
      role: (session?.user as any)?.role || null,
      profile_picture: session?.user?.image || null,
      loading: isLoadingToken,
    };
  };

  return { getAuthState };
};

// サーバーコンポーネントで使用する場合の例
export const getAuthServerSide = async () => {
  const session = await getServerSession(authOptions);
  return {
    user: session?.user || null,
    token: null,
    role: (session?.user as any)?.role || null,
    profile_picture: session?.user?.image || null,
    loading: false,
  };
};