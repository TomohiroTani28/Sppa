// src/hooks/api/useAuth.ts
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // NextAuth の設定をインポート
import { useState, useEffect } from "react";

// クライアントサイドで使用する認証フック
export const useAuth = () => {
  // NextAuth のセッションを取得（クライアントサイド）
  const { data: session, status } = useSession();
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);

  // ユーザーが認証済みの場合に JWT トークンを取得
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
      setJwtToken(null); // 未認証の場合はトークンをクリア
    }
  }, [status]);

  // 認証状態を直接返す
  return {
    user: session?.user || null,
    token: jwtToken,
    role: (session?.user as any)?.role || null,
    profile_picture: session?.user?.image || null,
    loading: status === "loading" || isLoadingToken,
    error: status === "unauthenticated" ? "User is not authenticated" : null,
  };
};

// サーバーコンポーネントまたは API ルートで使用する認証関数
export const getAuthServerSide = async () => {
  const session = await getServerSession(authOptions);
  return {
    user: session?.user || null,
    token: null, // サーバーサイドでは JWT を取得しない（必要に応じて追加可能）
    role: (session?.user as any)?.role || null,
    profile_picture: session?.user?.image || null,
    loading: false,
  };
};