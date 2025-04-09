// src/hooks/api/useAuth.ts
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AuthState } from "@/types/auth";

// クライアントサイドで使用する認証フック
export const useAuth = () => {
  const { data: session, status } = useSession();
  const [jwtToken, setJwtToken] = useState<string | undefined>(undefined);
  const [isLoadingToken, setIsLoadingToken] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchJwt = async () => {
        setIsLoadingToken(true);
        try {
          const response = await fetch("/api/auth/get-jwt");
          if (response.ok) {
            const data = await response.json();
            setJwtToken(data.token || undefined);
          } else {
            throw new Error(`Fetch failed: ${response.status}`);
          }
        } catch (error) {
          console.error("[useAuth] ❌ Failed to fetch JWT token:", error);
          setJwtToken(undefined);
        } finally {
          setIsLoadingToken(false);
        }
      };
      fetchJwt();
    } else if (status === "unauthenticated") {
      setJwtToken(undefined);
    }
  }, [status]);

  const getAuthState = async (): Promise<AuthState> => {
    if (!session?.user) {
      return {
        user: null,
        token: undefined,
        role: undefined,
        profile_picture: undefined,
        loading: false,
        error: undefined
      };
    }

    return {
      user: {
        id: session.user.id,
        name: session.user.name ?? undefined,
        email: session.user.email ?? undefined,
        image: session.user.image ?? undefined,
        role: (session.user as any).role ?? undefined
      },
      token: jwtToken,
      role: (session.user as any).role ?? undefined,
      profile_picture: session.user.image ?? undefined,
      loading: isLoadingToken,
      error: undefined
    };
  };

  return {
    session,
    status,
    jwtToken,
    isLoadingToken,
    getAuthState
  };
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
