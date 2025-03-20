// src/@types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

type UserRole = "therapist" | "tourist";

declare module "next-auth" {
  // NextAuth のユーザー型。verifyIdToken が直接返す User 型とする場合
  interface User extends DefaultUser {
    id: string;
    role: UserRole;
  }

  // Session 型は、ユーザー型そのものとして扱う（verifyIdToken の戻り値が User 型の場合）
  interface Session extends DefaultSession {
    // session.user は存在せず、session 直下に id, role を持つ前提
    id: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    accessToken?: string;
  }
}
