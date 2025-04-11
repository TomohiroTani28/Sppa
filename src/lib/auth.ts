import jwt from 'jsonwebtoken';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// 環境変数のバリデーション
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is not set');
}

// 実行時のチェックが済んでいるので、型アサーションは安全
const authSecret: string = process.env.NEXTAUTH_SECRET;

// HASURA_GRAPHQL_JWT_SECRET のバリデーションとパース
let jwtSecret: string;
let jwtType: jwt.Algorithm = 'HS256'; // Default algorithm

try {
  const jwtSecretConfig = JSON.parse(process.env.HASURA_GRAPHQL_JWT_SECRET ?? '{}');
  if (!jwtSecretConfig.key) {
    throw new Error('key is missing in HASURA_GRAPHQL_JWT_SECRET');
  }
  jwtSecret = jwtSecretConfig.key;
  if (jwtSecretConfig.type) {
    jwtType = jwtSecretConfig.type as jwt.Algorithm;
  }
  // Validate algorithm if needed
  const supportedAlgorithms: jwt.Algorithm[] = ['HS256', 'HS384', 'HS512', /* add others if used */];
  if (!supportedAlgorithms.includes(jwtType)) {
    throw new Error(`Unsupported JWT algorithm specified: ${jwtType}`);
  }

} catch (error: any) {
  throw new Error(`Failed to parse HASURA_GRAPHQL_JWT_SECRET: ${error.message}`);
}

// サポートしている role を配列として定義
const SUPPORTED_ROLES = ['tourist', 'therapist', 'admin', 'user'];

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // ここで認証ロジックを実装
          // 例: データベースでユーザーを検索し、パスワードを検証
          const user = {
            id: 'user-' + Math.random().toString(36).substring(7),
            email: credentials.email,
            name: 'Dummy User Name',
            role: 'user',
          };

          if (!user) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role ?? "anonymous"; // デフォルトロール設定
        
        // Hasura JWTクレームを正確なフォーマットで設定
        const hasuraClaims = {
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": [user.role ?? "anonymous"],
            "x-hasura-default-role": user.role ?? "anonymous",
            "x-hasura-user-id": user.id,
          }
        };
        
        try {
          // クレームを含むJWTトークンを生成
          token.access_token = jwt.sign(
            hasuraClaims,
            jwtSecret,
            { algorithm: jwtType }
          );
        } catch (error) {
          console.error("Error signing Hasura JWT:", error);
          token.access_token = "";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id ?? "";  // nullish演算子を使用して空文字列をフォールバック値とする
        if (token.role) {
          session.user.role = token.role;
        }
        
        // トークンをセッションに追加
        if (token.access_token) {
          session.access_token = token.access_token;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  secret: authSecret,
  debug: process.env.NODE_ENV === 'development',
} satisfies AuthOptions; 