// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { AuthOptions, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.SUPABASE_URL ?? "http://localhost:54330",
  process.env.SUPABASE_ANON_KEY ?? ""
);

// 認証のバリデーションを分離
const validateCredentials = (credentials: { email: string; password: string } | undefined) => {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }
  return credentials;
};

// Supabase認証を分離
const signInWithSupabase = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("❌ Supabase auth failed:", error.message);
    return null;
  }
  return data;
};

// ユーザー情報の構築を分離
const buildUser = (data: any) => {
  if (!data.user || !data.session) return null;
  const userName = data.user.user_metadata?.name ?? data.user.email;
  return {
    id: data.user.id,
    email: data.user.email ?? null,
    name: userName ?? null,
    access_token: data.session.access_token,
  };
};

// 統合されたauthorize関数
const authorizeUser = async (credentials: { email: string; password: string } | undefined) => {
  const validCredentials = validateCredentials(credentials);
  if (!validCredentials) return null;

  const data = await signInWithSupabase(validCredentials.email, validCredentials.password);
  if (!data) return null;

  return buildUser(data);
};

// NextAuth設定
export const authOptions: AuthOptions = {
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
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.id) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          image: null,
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