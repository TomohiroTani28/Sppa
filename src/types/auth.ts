// src/types/auth.ts
export interface AuthUser {
  id: string;
  name?: string | undefined;
  email?: string | undefined;
  image?: string | undefined;
  role?: string | undefined;
}

export interface AuthState {
  user: AuthUser | null;
  token?: string | undefined;
  role?: string | undefined;
  profile_picture?: string | undefined;
  loading: boolean;
  error?: string | undefined;
}