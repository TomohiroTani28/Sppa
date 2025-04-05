// src/app/api/auth/get-jwt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  console.log('[/api/auth/get-jwt] GET request received'); // ログを追加

  const session = await getServerSession(authOptions);
  console.log('[/api/auth/get-jwt] Session:', session); // ログを追加

  if (!session?.user?.email) {
    console.log('[/api/auth/get-jwt] Unauthorized: No user email in session'); // ログを追加
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const jwtSecret = process.env.NEXTAUTH_SECRET;
    if (!jwtSecret) {
      console.error('[/api/auth/get-jwt] NEXTAUTH_SECRET environment variable is not defined.'); // ログを追加
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const userRole = (session.user as any)?.role || 'user';

    const hasuraClaims = {
      'https://hasura.io/jwt/claims': {
        'x-hasura-default-role': userRole,
        'x-hasura-allowed-roles': [userRole],
        'x-hasura-user-id': session.user.email,
      },
    };

    const token = jwt.sign(hasuraClaims, jwtSecret, { algorithm: 'HS256' });

    console.log('[/api/auth/get-jwt] Successfully generated JWT:', token); // ログを追加
    return NextResponse.json({ token });
  } catch (error) {
    console.error('[/api/auth/get-jwt] Error generating JWT:', error); // ログを追加
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Edge runtime を使用する場合は以下をコメントアウトしてください
// export const runtime = 'edge';