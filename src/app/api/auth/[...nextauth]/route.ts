// src/app/api/auth/[...nextauth]/route.ts
import { authOptions } from '@/lib/auth';
import type { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth';

const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST };
