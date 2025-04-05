// src/app/api/auth/get-jwt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // NextAuth の設定ファイルのパスを調整してください
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 環境変数から JWT シークレットキーを読み込む
    const jwtSecret = process.env.NEXTAUTH_SECRET;
    if (!jwtSecret) {
      console.error('NEXTAUTH_SECRET environment variable is not defined.');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // ユーザーのロールを取得 (session オブジェクトに role が存在することを前提)
    const userRole = (session.user as any)?.role || 'user'; // デフォルトロールを設定

    // Hasura クレームを生成
    const hasuraClaims = {
      'https://hasura.io/jwt/claims': {
        'x-hasura-default-role': userRole,
        'x-hasura-allowed-roles': [userRole],
        'x-hasura-user-id': session.user.email, // email をユーザーIDとして使用 (必要に応じて変更)
      },
    };

    // JWT を生成
    const token = jwt.sign(hasuraClaims, jwtSecret, { algorithm: 'HS256' });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating JWT:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Edge runtime を使用する場合は以下をコメントアウトしてください
// export const runtime = 'edge';