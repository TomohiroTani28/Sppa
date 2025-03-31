"use client";
// src/app/signup/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase-client";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"tourist" | "therapist">("tourist");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("パスワードが一致しません");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }
    setSuccessMessage("登録に成功しました。確認メールをご確認ください。");
    // 数秒後にログイン画面へリダイレクト
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  const handleOAuthSignup = async (provider: "google" | "facebook") => {
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setErrorMessage(error.message);
    }
    // OAuth 認証後、リダイレクトは onAuthStateChange で処理されます
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-center text-3xl font-bold text-primary">Sppa アカウント登録</h2>
        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              お名前
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              パスワード確認
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">アカウント種別</span>
            <div className="mt-1 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="tourist"
                  checked={role === "tourist"}
                  onChange={() => setRole("tourist")}
                  className="form-radio h-4 w-4 text-primary"
                />
                <span className="ml-2">観光客</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="therapist"
                  checked={role === "therapist"}
                  onChange={() => setRole("therapist")}
                  className="form-radio h-4 w-4 text-primary"
                />
                <span className="ml-2">セラピスト</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            登録
          </button>
        </form>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => handleOAuthSignup("google")}
            className="flex items-center justify-center w-1/2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
          >
            Googleで登録
          </button>
          <button
            onClick={() => handleOAuthSignup("facebook")}
            className="flex items-center justify-center w-1/2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
          >
            Facebookで登録
          </button>
        </div>
        <div className="text-center">
          <p className="text-sm">
            すでにアカウントをお持ちの場合は{" "}
            <a href="/login" className="font-medium text-primary hover:underline">
              ログイン
            </a>{" "}
           してください。
          </p>
        </div>
      </div>
    </main>
  );
}
