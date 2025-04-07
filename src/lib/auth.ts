import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// 環境変数のバリデーション
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is not set');
}

// 実行時のチェックが済んでいるので、型アサーションは安全
const authSecret: string = process.env.NEXTAUTH_SECRET;

export const authOptions = {
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
            id: '1',
            email: credentials.email,
            name: 'Test User',
            role: 'user',
          };

          return user;
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        
        // Fix for exactOptionalPropertyTypes: true
        // Only assign role if it exists
        if (user.role !== undefined) {
          token.role = user.role;
          
          token['https://hasura.io/jwt/claims'] = {
            'x-hasura-allowed-roles': [user.role],
            'x-hasura-default-role': user.role,
            'x-hasura-user-id': user.id,
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Use type assertion to bypass the exactOptionalPropertyTypes check
        const userWithRole = session.user as any;
        
        userWithRole.id = token.id as string;
        userWithRole.email = token.email;
        userWithRole.name = token.name;
        
        // Only assign role if it exists
        if (token.role !== undefined) {
          userWithRole.role = token.role;
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