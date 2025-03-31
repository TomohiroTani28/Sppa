// src/app/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth.server";

export default async function HomePage() {
  const user = await auth();
  if (user) {
    if (user.role === "therapist") {
      redirect("/therapist/dashboard");
    } else {
      redirect("/home");
    }
  } else {
    redirect("/home");
  }
  return null;
}

export const dynamic = "force-dynamic";