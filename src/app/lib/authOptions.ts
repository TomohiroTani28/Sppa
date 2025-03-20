// src/app/lib/authOptions.ts
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { request } from "graphql-request";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface GetUserQuery {
  users: {
    id: string;
    email: string;
    password_hash: string;
    role: "therapist" | "tourist";
  }[];
}

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ?? "http://localhost:8081/v1/graphql";

async function fetchUserByEmail(email: string): Promise<GetUserQuery> {
  const query = `
    query GetUser($email: String!) {
      users(where: { email: { _eq: $email } }) {
        id
        email
        password_hash
        role
      }
    }
  `;
  return request<GetUserQuery>({
    url: GRAPHQL_ENDPOINT,
    document: query,
    variables: { email },
    requestHeaders: {
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET ?? "",
    },
  });
}

async function validateCredentials(credentials: { email: string; password: string }) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("メールアドレスとパスワードを入力してください");
  }
  const response = await fetchUserByEmail(credentials.email);
  const user = response.users[0];
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
  if (!isValidPassword) {
    throw new Error("パスワードが間違っています");
  }
  return { id: user.id, email: user.email, role: user.role };
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const user = await validateCredentials(credentials);
          return user;
        } catch (error: any) {
          console.error("Failed to authenticate user:", error.message);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      const tokenObj: Record<string, unknown> =
        typeof token === "object" && token !== null ? token : {};
      if (user) {
        return {
          ...tokenObj,
          id: user.id,
          role: user.role,
          hasuraClaims: {
            "x-hasura-allowed-roles": [user.role, "anonymous"],
            "x-hasura-default-role": user.role,
            "x-hasura-user-id": user.id,
          },
        };
      }
      return {
        ...tokenObj,
        id: (token as any).id ?? "",
        role: (token as any).role ?? "tourist",
      };
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: (token as any).id,
          role: (token as any).role,
        },
        hasuraClaims: (token as any).hasuraClaims,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  jwt: {
    async encode({ secret, token }) {
      const payload = {
        ...token,
        "https://hasura.io/jwt/claims": (token as any).hasuraClaims,
      };
      return jwt.sign(payload, secret, { algorithm: "HS256" });
    },
    async decode({ secret, token }) {
      if (!token) return null;
      try {
        const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
        if (typeof decoded !== "object" || decoded === null) {
          return null;
        }
        return {
          ...decoded,
          id: (decoded as any).id ?? "",
          role: (decoded as any).role ?? "tourist",
        };
      } catch (error) {
        console.error("JWT decode error:", error);
        return null;
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
};
