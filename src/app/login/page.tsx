"use client";
// src/app/login/page.tsx
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/app/lib/supabase-client";
import { saveRedirectPath, getRedirectPath, clearRedirectPath } from "@/app/lib/storage-utils";
import { getClientSideUser } from "@/app/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) {
      saveRedirectPath(redirectParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getClientSideUser();
      if (user) {
        let redirectTo = getRedirectPath();
        clearRedirectPath();
        if (!redirectTo) {
          redirectTo = "/tourist/home"; // デフォルトはホーム画面
        }
        router.replace(redirectTo);
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    // ログイン成功後、キャッシュされたパスにリダイレクト
    const redirectTo = getRedirectPath() || "/tourist/home";
    clearRedirectPath();
    router.replace(redirectTo);
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setErrorMessage(error.message);
    }
    // OAuthログイン後のリダイレクトは Supabase のコールバックで処理されるが、
    // 必要に応じてキャッシュを活用するために調整可能
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-center text-3xl font-bold text-primary">Sppa ログイン</h2>
        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            ログイン
          </button>
        </form>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => handleOAuthLogin("google")}
            className="flex items-center justify-center w-1/2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
          >
            Googleでログイン
          </button>
          <button
            onClick={() => handleOAuthLogin("facebook")}
            className="flex items-center justify-center w-1/2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
          >
            Facebookでログイン
          </button>
        </div>
        <div className="text-center">
          <p className="text-sm">
            アカウントをお持ちでない方は{" "}
            <a href="/signup" className="font-medium text-primary hover:underline">
              こちら
            </a>{" "}
            から登録してください。
          </p>
        </div>
      </div>
    </main>
  );
}