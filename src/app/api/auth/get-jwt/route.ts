// src/app/api/auth/get-jwt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  console.log('[/api/auth/get-jwt] GET request received');

  console.log('[/api/auth/get-jwt] Calling getServerSession...');
  const session = await getServerSession(authOptions);
  console.log('[/api/auth/get-jwt] getServerSession result:', session);

  if (!session?.user) {
    console.log('[/api/auth/get-jwt] Unauthorized: No user object in session');
    return NextResponse.json({ error: 'Unauthorized - No user' }, { status: 401 });
  }

  if (!session?.user?.email) {
    console.log('[/api/auth/get-jwt] Unauthorized: No user email in session');
    return NextResponse.json({ error: 'Unauthorized - No email' }, { status: 401 });
  }

  console.log('[/api/auth/get-jwt] User email found in session:', session.user.email);

  try {
    const jwtSecret = process.env.NEXTAUTH_SECRET;
    console.log('[/api/auth/get-jwt] NEXTAUTH_SECRET environment variable:', jwtSecret ? 'Defined' : 'Undefined');
    if (!jwtSecret) {
      console.error('[/api/auth/get-jwt] Error: NEXTAUTH_SECRET environment variable is not defined.');
      return NextResponse.json({ error: 'Internal Server Error - No secret' }, { status: 500 });
    }

    const userRole = (session.user as any)?.role || 'user';
    console.log('[/api/auth/get-jwt] User role from session:', userRole);

    const hasuraClaims = {
      'https://hasura.io/jwt/claims': {
        'x-hasura-default-role': userRole,
        'x-hasura-allowed-roles': [userRole],
        'x-hasura-user-id': session.user.id,
      },
    };
    console.log('[/api/auth/get-jwt] Generated Hasura claims:', hasuraClaims);

    console.log('[/api/auth/get-jwt] Signing JWT with secret:', jwtSecret.substring(0, 10), '...'); // JWT 署名開始ログ（最初の数文字のみ表示）
    const token = jwt.sign(hasuraClaims, jwtSecret, { algorithm: 'HS256' });
    console.log('[/api/auth/get-jwt] Successfully generated JWT:', token);

    return NextResponse.json({ token });
  } catch (error: any) { // エラーの型を any または Error に指定
    console.error('[/api/auth/get-jwt] Error generating JWT:', error);
    console.error('[/api/auth/get-jwt] Error details:', error.message);
    return NextResponse.json({ error: 'Internal Server Error - JWT error' }, { status: 500 });
  }
}

// Edge runtime を使用する場合は以下をコメントアウトしてください
// export const runtime = 'edge';