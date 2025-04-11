// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // パスのチェックを簡略化して複雑な条件式を整理
  const publicPaths = ["/login", "/signup", "/api/auth", "/_next", "/public"];
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path));
  
  // 公開エンドポイントの場合は処理をスキップ
  if (isPublicPath) {
    return NextResponse.next();
  }

  // 環境変数が存在することを確認してから渡す
  const secret = process.env.NEXTAUTH_SECRET || "";
  
  // NextAuth JWT トークンを確認
  const token = await getToken({ 
    req, 
    secret // undefinedの可能性を排除
  });

  // 非認証の場合はログインページにリダイレクト
  if (!token) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
    console.log("[middleware] No session, redirecting to login:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 以下のパスにマッチする場合にミドルウェアを適用
    "/tourist/:path*",
    "/therapist/:path*",
    "/(common)/:path*",
  ],
};