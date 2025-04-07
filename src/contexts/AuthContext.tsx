// src/contexts/AuthContext.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Session } from "next-auth";

interface AuthContextType {
  user: Session['user'] | null;
  loading: boolean;
  error: string | null;
  accessToken?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<Session['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else if (status === "authenticated") {
      setUser(session?.user ?? null);
      setLoading(false);
    } else if (status === "unauthenticated") {
      setUser(null);
      setLoading(false);
      router.push("/login");
    }
  }, [status, session, router]);

  const contextValue = useMemo(() => ({
    user,
    loading,
    error: null,
    accessToken: session?.access_token
  }), [user, loading, session?.access_token]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};