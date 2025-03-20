// src/app/lib/auth.ts
import supabase from "@/app/lib/supabase-client";

type SppaRole = "tourist" | "therapist" | null;
export type SppaUser = {
  id: string;
  email: string;
  role: SppaRole;
  name?: string;
  phone_number?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  verified_at?: string;
} | null;

const handleSupabaseError = (
  error: any,
  context: string
): { data: null; error: any } => {
  console.error(`${context} error:`, error);
  return { data: null, error };
};

const mapToSppaUser = (user: any): SppaUser => ({
  id: user.id,
  email: user.email || "",
  role: (user.user_metadata?.role as SppaRole) || "tourist",
  name: user.user_metadata?.name,
  phone_number: user.user_metadata?.phone_number,
  profile_picture: user.user_metadata?.profile_picture,
  created_at: user.created_at,
  updated_at: user.updated_at || user.created_at,
  verified_at: user.email_confirmed_at,
});

export const signInWithEmailPassword = async (
  email: string,
  password: string
): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    console.log("Signed in successfully:", data.user?.email);
    return { data, error: null };
  } catch (error) {
    return handleSupabaseError(error, "Sign-in");
  }
};

export const signUpWithEmailPassword = async (
  email: string,
  password: string,
  options: { role: SppaRole; name?: string; phone_number?: string } = {
    role: "tourist",
  }
): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: options },
    });
    if (error) throw error;
    console.log("Signed up successfully:", data.user?.email);
    return { data, error: null };
  } catch (error) {
    return handleSupabaseError(error, "Sign-up");
  }
};

export const signOut = async (): Promise<{ error: any }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log("Signed out successfully");
    return { error: null };
  } catch (error) {
    return handleSupabaseError(error, "Sign-out");
  }
};

/**
 * クライアントサイドでユーザーを取得する
 */
export const getClientSideUser = async (): Promise<SppaUser> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // 「Auth session missing!」は未ログインなので通常のnull返却にする
    if (error) {
      if (error.message?.includes("Auth session missing")) {
        console.log("No session found (getClientSideUser), returning null");
        return null;
      } else {
        console.error("Failed to get user:", error?.message);
        return null;
      }
    }

    if (!user) {
      console.log("No user found (getClientSideUser), returning null");
      return null;
    }

    return mapToSppaUser(user);
  } catch (error) {
    return handleSupabaseError(error, "Fetch client-side user").data;
  }
};

/**
 * セッションからロールを取得する
 */
export const getSessionRole = async (): Promise<SppaRole> => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    // 「Auth session missing!」は未ログインなので通常の"tourist"扱いにする
    if (error) {
      if (error.message?.includes("Auth session missing")) {
        console.log("No session found (getSessionRole), returning 'tourist'");
        return "tourist";
      } else {
        console.error("Failed to get session role:", error?.message);
        return "tourist";
      }
    }

    if (!session?.user) {
      console.log("No user in session (getSessionRole), returning 'tourist'");
      return "tourist";
    }

    return (session.user.user_metadata?.role as SppaRole) || "tourist";
  } catch (error) {
    console.error("Error fetching session role:", error);
    return "tourist";
  }
};

/**
 * サーバーサイドでユーザーを認証する
 */
export const auth = async (): Promise<SppaUser> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      if (error.message?.includes("Auth session missing")) {
        console.log("No session found, returning null");
        return null;
      } else {
        console.error("Failed to authenticate user:", error?.message);
        return null;
      }
    }

    if (!user) {
      console.log("No user found, returning null");
      return null;
    }

    const sppaUser = mapToSppaUser(user);
    if (sppaUser) {
      console.log("Authenticated user:", sppaUser.email, "Role:", sppaUser.role);
    }
    return sppaUser;
  } catch (error) {
    return handleSupabaseError(error, "Authentication").data;
  }
};