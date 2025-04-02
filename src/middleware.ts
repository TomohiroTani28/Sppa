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

  const isAuthenticated = !!session;
  const { pathname } = req.nextUrl;

  const isAuthPage = ["/login", "/signup"].includes(pathname);
  const isProtectedPage = pathname.startsWith("/tourist");

  // 👤 未ログインかつ保護ルートへアクセス → login にリダイレクト
  if (!isAuthenticated && isProtectedPage) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ ログイン中に /login or /signup に来たら /tourist/home にリダイレクト
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/tourist/home", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/tourist/:path*", "/login", "/signup"],
};
