// src/types/local-experience.ts
export interface LocalExperience {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category_id: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

// フックの戻り値の型
export interface UseLocalExperiencesHook {
  experiences: LocalExperience[];
  loading: boolean;
  error: Error | null;
  fetchExperiences: (options?: FetchOptions) => Promise<void>;
}

// フェッチオプションの型
interface FetchOptions {
  limit?: number;
  offset?: number;
  where?: any; // Hasuraのwhere条件を柔軟に指定可能
}