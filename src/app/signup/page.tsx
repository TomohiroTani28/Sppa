// src/app/signup/page.tsx
import SignUpForm from "@/components/auth/SignUpForm";
import type { Metadata } from 'next';

// 動的レンダリングを強制する設定
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign Up | Sppa",
  description: "Create your Sppa account",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}