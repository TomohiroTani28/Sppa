// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "supabase",
      name: "Supabase",
      type: "oauth",
      clientId: process.env.SUPABASE_URL,
      clientSecret: process.env.SUPABASE_ANON_KEY,
      authorization: `${process.env.SUPABASE_URL}/auth/v1/authorize`,
      token: `${process.env.SUPABASE_URL}/auth/v1/token`,
      userinfo: `${process.env.SUPABASE_URL}/auth/v1/user`,
      async profile(profile) {
        return {
          id: profile.id,
          email: profile.email,
          name: profile.user_metadata?.full_name || profile.email,
        };
      },
    },
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };