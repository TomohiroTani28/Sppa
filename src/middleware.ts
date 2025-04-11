import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // 1. API以外のパスで認証を確認
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    // 公開ルートは認証不要
    if (
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/signup')
    ) {
      return NextResponse.next();
    }
    
    // それ以外のルートでは認証を確認
    const token = await getToken({ req: request });
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // 2. APIリクエストのJWTトークンを検証
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // /api/auth/* パスは認証処理自体なので除外
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
      return NextResponse.next();
    }
    
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (NextAuth authentication routes)
     * 2. /_next/* (Next.js system files)
     * 3. /fonts/* (static font files)
     * 4. /images/* (static image files)
     * 5. /favicon.ico, /site.webmanifest (browser files)
     */
    '/((?!api/auth|_next|fonts|images|favicon.ico|site.webmanifest).*)',
    '/api/((?!auth).*)',
  ],
}; 