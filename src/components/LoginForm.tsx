// src/components/LoginForm.tsx
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Spinner } from "@/components/ui/Spinner";
import { emailSchema, passwordSchema } from "@/lib/validations/form";
import { login } from "@/utils/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

type LoginFormData = z.infer<typeof loginFormSchema>;

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Extract error messages
  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        id="email"
        label="メールアドレス"
        type="email"
        {...(emailError && { error: emailError })}
        {...register("email")}
      />

      <FormField
        id="password"
        label="パスワード"
        type="password"
        {...(passwordError && { error: passwordError })}
        {...register("password")}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Spinner /> : "ログイン"}
      </Button>
    </form>
  );
};

export default LoginForm;
