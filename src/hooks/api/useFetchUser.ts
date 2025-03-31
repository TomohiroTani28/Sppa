// src/hooks/api/useFetchUser.ts
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/lib/queries/user";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profile_picture: string;
  nationality: string;
  languages: string[];
  interests?: Record<string, any>; // JSONB型に対応
  travel_dates?: { start_date: string; end_date: string }; // JSONB型に対応
}

export const useFetchUser = (userId: string) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, loading: queryLoading, error: queryError } = useQuery(GET_USER_PROFILE, {
    variables: { user_id: userId },
    skip: !userId,
  });

  useEffect(() => {
    if (queryLoading) {
      setLoading(true);
    } else if (queryError) {
      setError(queryError.message);
      setLoading(false);
    } else if (data) {
      const profile = data.users_by_pk;
      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          profile_picture: profile.profile_picture || "", // デフォルト値として空文字列
          nationality: profile.tourist_profile?.nationality || "",
          languages: profile.tourist_profile?.languages || [],
          interests: profile.tourist_profile?.interests || undefined,
          travel_dates: profile.tourist_profile?.travel_dates || undefined,
        });
      } else {
        setUser(null); // ユーザーが見つからない場合
      }
      setLoading(false);
    }
  }, [data, queryLoading, queryError]);

  return { user, loading, error };
};