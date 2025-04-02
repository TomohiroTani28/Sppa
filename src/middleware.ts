// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuth = !!session;
  const { pathname } = req.nextUrl;

  const isAuthPage = ["/login", "/signup"].includes(pathname);
  const isProtectedPage = pathname.startsWith("/tourist");

  // 🔐 認証が必要なページに未ログインでアクセス → ログイン画面へ
  if (!isAuth && isProtectedPage) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 👋 ログイン中にログイン or サインアップ画面へアクセス → ホームへリダイレクト
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL("/tourist/home", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/tourist/:path*",
  ],
};
