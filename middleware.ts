// src/app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

export async function middleware(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  // ログイン必須のページが /tourist から始まる場合のみチェックし、未ログインなら /login へリダイレクト
  if (!session && req.nextUrl.pathname.startsWith('/tourist')) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/tourist/:path*'],
};
