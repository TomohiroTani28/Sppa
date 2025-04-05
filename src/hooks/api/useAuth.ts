// src/hooks/api/useAuth.ts
"use client";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useState, useEffect } from "react";

interface AuthState {
  user: Session["user"] | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const { data: session, status } = useSession();
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);

  useEffect(() => {
    const fetchJwt = async () => {
      if (status === "authenticated" && !jwtToken) {
        setIsLoadingToken(true);
        try {
          // APIルートを呼び出してサーバーサイドで生成されたJWTを取得
          const response = await fetch('/api/auth/get-jwt'); 
          if (response.ok) {
            const data = await response.json();
            // APIルートが { token: "..." } のような形式で返すことを想定
            setJwtToken(data.token || null);
             console.log("✅ Successfully fetched JWT token from API route.");
          } else {
            console.error("❌ Failed to fetch JWT token:", response.statusText);
            setJwtToken(null);
          }
        } catch (error) {
          console.error("❌ Error fetching JWT token:", error);
          setJwtToken(null);
        } finally {
          setIsLoadingToken(false);
        }
      } else if (status === "unauthenticated") {
        setJwtToken(null); // 未認証ならトークンをクリア
      }
    };

    fetchJwt();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, jwtToken]); // jwtTokenを追加して再取得を防ぐ

  // user や role は session オブジェクトから取得可能
  // 注意: session.user.role が存在するかは next-auth.d.ts と session コールバック次第
  const userRole = (session?.user as any)?.role || null;

  // 全体のローディング状態は、セッションのロードとJWTのロードの両方を考慮
  const isLoading = status === "loading" || isLoadingToken;

  // デバッグ用ログ
  // useEffect(() => {
  //   if (!isLoading) {
  //     console.log("useAuth state:", {
  //       user: session?.user || null,
  //       token: jwtToken,
  //       role: userRole,
  //       loading: isLoading,
  //     });
  //   }
  // }, [isLoading, session, jwtToken, userRole]);


  return {
    user: session?.user || null,
    token: jwtToken,
    role: userRole,
    profile_picture: session?.user?.image || null,
    loading: isLoading,
  };
};

export default useAuth;