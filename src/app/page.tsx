// src/app/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth.server";
import dynamicImport from "next/dynamic";
import FeedPageWrapper from "@/app/(common)/feed/components/FeedPageWrapper";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "therapist") {
    redirect("/therapist/dashboard");
  }

  return <FeedPageWrapper />;
}
