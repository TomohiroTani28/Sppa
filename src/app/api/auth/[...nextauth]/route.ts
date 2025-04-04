// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

// Supabaseクライアントの初期化（フォールバック値付き）
const supabase = createClient(
  process.env.SUPABASE_URL ?? "http://localhost:54330",
  process.env.SUPABASE_ANON_KEY ?? ""
);

// NextAuthの型を拡張
declare module "next-auth" {
  interface User {
    id: string;
    email?: string;
    name?: string;
    access_token?: string;
  }

  interface Session {
    access_token?: string;
    user: {
      id: string;
      email?: string;
      name?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    id?: string;
    email?: string;
    name?: string;
  }
}

// 認証関数
const authorizeUser = async (credentials: { email: string; password: string } | undefined) => {
  if (!credentials?.email || !credentials?.password) return null;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    console.error("❌ Supabase auth failed:", error.message);
    return null;
  }

  if (!data.user || !data.session) return null;

  const userName = data.user.user_metadata?.name;
  const name = userName !== undefined ? userName : data.user.email;

  console.log("Supabase session data:", data.session);

  return {
    id: data.user.id,
    email: data.user.email ?? undefined,
    name,
    access_token: data.session.access_token,
  };
};

// NextAuth設定
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Supabase Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: authorizeUser,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
        };
        session.access_token = token.access_token;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };