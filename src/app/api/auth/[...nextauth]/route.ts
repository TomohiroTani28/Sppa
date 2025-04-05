// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { AuthOptions, User as NextAuthUser, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

// --- Supabaseクライアント初期化 ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase URL or Anon Key in environment variables.");
  throw new Error("Supabase configuration is missing.");
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- ヘルパー関数 ---

// 認証情報バリデーション
const validateCredentials = (credentials: Record<string, string> | undefined) => {
  if (!credentials?.email || !credentials?.password) {
    console.log("❌ Invalid or missing credentials");
    return null;
  }
  return { email: credentials.email, password: credentials.password };
};

// Supabaseでのサインイン処理
const signInWithSupabase = async (email: string, password: string) => {
  console.log(`Attempting Supabase sign in for: ${email}`);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("❌ Supabase auth failed:", error.message);
    return null;
  }
  console.log(`✅ Supabase sign in successful for: ${email}`);
  return data; // { user, session } を含むオブジェクト
};

// NextAuth用のUserオブジェクト型 (ロール情報を含む)
interface AppUser extends NextAuthUser {
  id: string;
  email: string | null;
  name: string | null;
  role: string; // Hasuraで使用するロール
  // access_token?: string; // Supabaseのトークンは通常不要
}

// SupabaseのデータからNextAuthのUserオブジェクトを構築
const buildUser = (supabaseData: { user: any; session: any } | null): AppUser | null => {
  if (!supabaseData?.user || !supabaseData?.session) return null;

  const user = supabaseData.user;

  // Supabaseのuser_metadataからロールを取得 (重要！)
  // デフォルトロールを 'user' とします。環境に合わせて変更してください。
  // Supabase側でuser_metadataに'role'が設定されている必要があります。
  const role = user.user_metadata?.role ?? 'user';
  const userName = user.user_metadata?.name ?? user.email; // 名前がない場合はemailを使用

  console.log(`Building user object: id=${user.id}, email=${user.email}, role=${role}, name=${userName}`);

  return {
    id: user.id,
    email: user.email ?? null,
    name: userName ?? null,
    role: role, // 取得したロールを設定
    // access_token: supabaseData.session.access_token, // 通常クライアントに渡す必要はない
  };
};

// authorize関数: 認証情報の検証、Supabase認証、ユーザー構築を行う
const authorizeUser = async (credentials: Record<string, string> | undefined): Promise<AppUser | null> => {
  const validCredentials = validateCredentials(credentials);
  if (!validCredentials) return null;

  const supabaseData = await signInWithSupabase(validCredentials.email, validCredentials.password);
  if (!supabaseData) return null;

  return buildUser(supabaseData);
};

// --- NextAuth設定 ---
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AppUser | null> {
        // authorizeUser を呼び出して AppUser または null を返す
        return authorizeUser(credentials as Record<string, string>);
      }
    }),
    // 他のプロバイダー (例: Google) を追加する場合はここに記述
  ],
  session: {
    strategy: "jwt", // セッション管理にJWTを使用
  },
  callbacks: {
    /**
     * JWTコールバック:
     * - サインイン時に呼び出され、トークンにユーザー情報を格納します。
     * - ☆★☆ ここでHasuraクレームを生成・追加します ☆★☆
     */
    async jwt({ token, user, account, profile, isNewUser }: { token: JWT; user?: NextAuthUser | AppUser; account?: any; profile?: any; isNewUser?: boolean }) {
      // `user` はサインイン成功時に authorize 関数から渡される AppUser オブジェクト
      const appUser = user as AppUser | undefined; // 型ガード/アサーション

      if (appUser) {
        // === サインイン時 (userオブジェクトが存在する場合) ===
        console.log(`JWT callback: Populating token for user: ${appUser.id}`);
        token.id = appUser.id;
        token.email = appUser.email;
        token.name = appUser.name;
        token.role = appUser.role; // ロール情報をトークンに保持

        // --- Hasura JWT クレームの生成 ---
        const hasuraClaims = {
          "x-hasura-allowed-roles": [appUser.role], // ユーザーのロールを許可リストに入れる (複数ロール対応も可能)
          "x-hasura-default-role": appUser.role,    // デフォルトロールを設定
          "x-hasura-user-id": appUser.id,           // ユーザーIDを設定
          // 必要に応じて他のカスタムクレームを追加:
          // "x-company-id": user.companyId,
        };

        // トークンにHasuraクレームを追加
        token["https://hasura.io/jwt/claims"] = hasuraClaims;

        console.log("Generated Hasura claims:", hasuraClaims);

      } else {
         // === 既存セッションの読み込み時 (userオブジェクトが存在しない場合) ===
         // console.log("JWT callback: Reading existing token.");
         // 既存のトークンにはすでにHasuraクレームが含まれているはず
      }

      return token; // 更新されたトークンを返す
    },

    /**
     * Sessionコールバック:
     * - クライアント側で `useSession` や `getSession` を使った際に呼び出されます。
     * - JWTトークンからセッションオブジェクトに必要な情報を抽出します。
     */
    async session({ session, token }: { session: Session; token: JWT }) {
      // セッションのuserオブジェクトに必要な情報をJWTトークンからコピー
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
        // セッションにロール情報を含める (クライアント側で利用する場合)
        // (session as any).user.role = token.role; // 型定義を拡張する必要がある場合
      }

      // デバッグ用にセッション情報をログ出力
      // console.log("Session callback: Populated session:", session);

      // 注意: 生のアクセストークン (Supabaseのトークンなど) をクライアントセッションに含めるのは避ける
      // session.accessToken = token.accessToken as string;

      return session; // 更新されたセッションを返す
    },
  },
  pages: {
    signIn: "/login", // カスタムログインページのパス
    // error: '/auth/error', // エラーページのパス (任意)
  },
  secret: process.env.NEXTAUTH_SECRET, // .envファイルからシークレットを読み込む
  debug: process.env.NODE_ENV === 'development', // 開発環境でのみデバッグログを有効化
};

// NextAuthハンドラのエクスポート
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };