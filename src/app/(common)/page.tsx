// src/app/tourist/page.tsx
"use client";

import WelcomeMessage from "@/app/(common)/home/components/WelcomeMessage";
import BottomNavigation from "@/app/components/common/BottomNavigation";
import supabase from "@/app/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserPreferences {
  language: string;
  theme: string;
}

interface Location {
  country: string;
  city: string;
}

export default function TouristPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setPreferences({ language: "en", theme: "light" });
      setUserLocation({ country: "Japan", city: "Tokyo" });
    };

    fetchUser();
  }, [router]);

  if (![user, preferences, userLocation].every(Boolean)) {
    return <p>Loading...</p>;
  }  

  return (
    <main>
      <WelcomeMessage user={user} />
      <section>
        <h2>観光情報</h2>
        <p>観光客向けのおすすめ情報を表示します。</p>
      </section>
      <BottomNavigation userType="tourist" />
    </main>
  );
}
