"use client";
// src/app/login/page.tsx
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { clearRedirectPath, getRedirectPath, saveRedirectPath } from "@/lib/storage-utils";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LoginForm() {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
  
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log("[Login] signIn result:", result);
  
      if (result?.error) {
        setErrorMessage(result.error);
        return;
      }
  
      const redirectTo = getRedirectPath() || "/feed";
      console.log("[Login] リダイレクト先:", redirectTo);
      clearRedirectPath();
      router.replace(redirectTo);
    } catch (error) {
      console.error("[Login] エラー:", error);
      setErrorMessage("ログイン処理中にエラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="mb-4 p-2 border rounded w-full"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="mb-4 p-2 border rounded w-full"
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Login
          </button>
        </form>
        {errorMessage && (
          <div className="text-center text-sm text-red-500">{errorMessage}</div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  );
}