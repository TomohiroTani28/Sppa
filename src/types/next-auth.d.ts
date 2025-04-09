// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

// `next-auth` の型を拡張
declare module "next-auth" {
  interface Session {
    access_token?: string;
    user: {
      id: string;
      name?: string | undefined;
      email?: string | undefined;
      image?: string | undefined;
      role?: string | undefined;
    } & DefaultSession["user"];
  }

  // User インターフェースを拡張
  interface User extends DefaultUser {
    id: string;
    email?: string | null | undefined;
    name?: string | null | undefined;
    access_token?: string;
    role?: string;
  }
}

// `next-auth/jwt` の型を拡張
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string | null | undefined;
    name?: string | null | undefined;
    access_token?: string;
    role?: string;
  }
}