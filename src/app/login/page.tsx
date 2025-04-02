"use client";
// src/app/login/page.tsx
import LoginForm from "@/components/auth/LoginForm";
import { getUser } from "@/lib/auth.client";
import { clearRedirectPath, getRedirectPath, saveRedirectPath } from "@/lib/storage-utils";
import supabase from "@/lib/supabase-client";
import { Metadata } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const metadata: Metadata = {
  title: "Login | Sppa",
  description: "Login to your Sppa account",
};

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
      const user = await getUser();
      if (user) {
        let redirectTo = getRedirectPath();
        clearRedirectPath();
        if (!redirectTo) {
          redirectTo = "/tourist/home";
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
    const redirectTo = getRedirectPath() ?? "/tourist/home";
    clearRedirectPath();
    router.replace(redirectTo);
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}