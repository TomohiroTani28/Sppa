// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

// `next-auth` の型を拡張
declare module "next-auth" {
  interface Session extends DefaultSession {
    access_token?: string;
    user: {
      id: string;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
      role?: string;
    };
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