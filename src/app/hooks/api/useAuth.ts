// src/app/hooks/api/useAuth.ts
"use client";
import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabase-client";
import { User, Session } from "@supabase/supabase-js";

// JWTトークンをデコードしてロールを取得する関数
const decodeToken = (token: string): "therapist" | "tourist" => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role =
      payload["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"];
    return role === "therapist" ? "therapist" : "tourist";
  } catch (error) {
    console.error("トークンのデコードに失敗しました:", error);
    return "tourist";
  }
};

interface AuthState {
  user: User | null;
  token?: string;
  role?: "therapist" | "tourist";
  profile_picture?: string | null;
  login: (email: string, password: string) => Promise<{ user: User; session: Session }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const getInitialSession = async (
  setUser: (user: User | null) => void,
  setSession: (session: Session | null) => void,
  setLoading: (loading: boolean) => void
) => {
  if (!supabase) {
    console.error("Supabase client is not initialized.");
    setLoading(false);
    return;
  }

  try {
    console.log("Fetching initial session...");
    let sessionData = await supabase.auth.getSession();
    // セッションが取得できない場合、リトライを試みる
    if (!sessionData.data.session) {
      console.warn("No initial session, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待機
      sessionData = await supabase.auth.getSession();
    }

    if (sessionData.error) {
      console.error("Error fetching session:", sessionData.error.message);
      setUser(null);
      setSession(null);
    } else if (!sessionData.data.session) {
      console.warn("No active session found.");
      setUser(null);
      setSession(null);
    } else {
      console.log("Initial session fetched:", {
        access_token: sessionData.data.session.access_token.substring(0, 20) + "...",
        user_id: sessionData.data.session.user.id,
      });
      setUser(sessionData.data.session.user);
      setSession(sessionData.data.session);
    }
  } catch (error) {
    console.error("Unexpected error fetching session:", error);
    setUser(null);
    setSession(null);
  } finally {
    setLoading(false);
  }
};

const setupAuthListener = (
  setUser: (user: User | null) => void,
  setSession: (session: Session | null) => void,
  setLoading: (loading: boolean) => void
) => {
  if (!supabase) return undefined;

  console.log("Setting up auth listener...");
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log(`Auth event: ${event}`, {
        access_token:
          session?.access_token?.substring(0, 20) + "..." || "none",
        user_id: session?.user?.id || "none",
        role: session ? decodeToken(session.access_token) : "tourist",
      });
      if (session?.user) {
        setUser(session.user);
        setSession(session);
      } else {
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    }
  );

  return authListener;
};

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      await getInitialSession(
        (u) => isMounted && setUser(u),
        (s) => isMounted && setSession(s),
        (l) => isMounted && setLoading(l)
      );

      const authListener = setupAuthListener(
        (u) => isMounted && setUser(u),
        (s) => isMounted && setSession(s),
        (l) => isMounted && setLoading(l)
      );

      return () => {
        isMounted = false;
        authListener?.subscription?.unsubscribe?.();
      };
    };

    initializeAuth().catch((error) => {
      console.error("Auth initialization failed:", error);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error("Supabase client unavailable.");
    }
    try {
      console.log("Attempting login with:", { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(`Login failed: ${error.message}`);
      if (!data.user || !data.session) throw new Error("No user data returned");

      console.log("Login successful:", {
        user: data.user.id,
        token: data.session.access_token.substring(0, 20) + "...",
      });
      setUser(data.user);
      setSession(data.session);
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (!supabase) {
      throw new Error("Supabase client unavailable.");
    }
    try {
      console.log("Logging out...");
      const { error } = await supabase.auth.signOut();

      if (error) throw new Error(`Logout failed: ${error.message}`);

      setUser(null);
      setSession(null);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const role = session ? decodeToken(session.access_token) : "tourist";

  return {
    user,
    token: session?.access_token,
    role,
    profile_picture: user?.user_metadata?.profile_picture || null,
    login,
    logout,
    loading,
  };
};

export default useAuth;
