// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: 'therapist' | 'tourist' | 'admin';
          profile_picture: string | null;
          phone_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          role?: 'therapist' | 'tourist' | 'admin';
          profile_picture?: string | null;
          phone_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          role?: 'therapist' | 'tourist' | 'admin';
          profile_picture?: string | null;
          phone_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
    };
    Functions: {
      // Supabase のカスタム関数があれば記述
    };
    Enums: {
    };
  };
}
