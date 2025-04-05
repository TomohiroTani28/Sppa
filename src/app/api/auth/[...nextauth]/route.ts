// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase URL or Anon Key.");
  throw new Error("Supabase configuration is missing.");
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const validateCredentials = (credentials: Record<string, string> | undefined) => {
  if (!credentials?.email || !credentials?.password) {
    console.log("❌ Invalid or missing credentials");
    return null;
  }
  return { email: credentials.email, password: credentials.password };
};

const signInWithSupabase = async (email: string, password: string) => {
  console.log(`Attempting Supabase sign in for: ${email}`);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  console.log("Supabase auth response:", { data, error });
  if (error) {
    console.error("❌ Supabase auth failed:", error.message);
    return null;
  }
  return data;
};

interface AppUser extends NextAuthUser {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
}

const buildUser = (supabaseData: { user: any; session: any } | null): AppUser | null => {
  if (!supabaseData?.user) return null;

  const user = supabaseData.user;
  const role = user.user_metadata?.role ?? "tourist";
  const userName = user.user_metadata?.name ?? user.email ?? "Unknown";

  console.log(`Building user object: id=${user.id}, email=${user.email}, role=${role}, name=${userName}`);

  return {
    id: user.id,
    email: user.email ?? null,
    name: userName,
    role: role,
  };
};

const authorizeUser = async (credentials: Record<string, string> | undefined): Promise<AppUser | null> => {
  const validCredentials = validateCredentials(credentials);
  if (!validCredentials) return null;

  const supabaseData = await signInWithSupabase(validCredentials.email, validCredentials.password);
  if (!supabaseData) return null;

  return buildUser(supabaseData);
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AppUser | null> {
        return authorizeUser(credentials as Record<string, string>);
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      const appUser = user as AppUser | undefined;
      if (appUser) {
        console.log(`JWT callback: Populating token for user: ${appUser.id}`);
        token.id = appUser.id;
        token.email = appUser.email;
        token.name = appUser.name;
        token.role = appUser.role;

        const hasuraClaims = {
          "x-hasura-allowed-roles": [appUser.role],
          "x-hasura-default-role": appUser.role,
          "x-hasura-user-id": appUser.id,
        };
        token["https://hasura.io/jwt/claims"] = hasuraClaims;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };