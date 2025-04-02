// src/app/page.tsx
import dynamicImport from "next/dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth.server";

// FeedPage はクライアントコンポーネントなので SSR 無効で読み込み
const FeedPage = dynamicImport(() => import("@/app/(common)/feed/page"), {
  ssr: false,
});

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "therapist") {
    redirect("/therapist/dashboard");
  }

  return <FeedPage />;
}
