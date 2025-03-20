// src/types/match.ts
/**
 * マッチング情報を表す型。
 * `likes` テーブルに基づき、観光客（guest）とセラピスト（therapist）のマッチングを表現。
 */
export interface Match {
    id: string; // UUID (likes.id)
    guest_id: string; // UUID (likes.guest_id, users.id への外部キー)
    therapist_id: string; // UUID (likes.therapist_id, users.id への外部キー)
    is_matched: boolean; // マッチング成立フラグ (likes.is_matched)
    matched_at?: string; // マッチング成立日時 (ISO8601形式, likes.matched_at)
    created_at: string; // レコード作成日時 (ISO8601形式, likes.created_at)
    therapist: Therapist; // 関連するセラピスト情報
  }
  
  /**
   * セラピストの基本情報を表す型。
   * `users` と `therapist_profiles` テーブルから派生。
   */
  export interface Therapist {
    id: string; // UUID (users.id)
    name: string; // セラピストの名前 (users.name)
    profile_picture?: string; // プロフィール画像URL (users.profile_picture, オプショナル)
    status?: "online" | "offline" | "busy" | "vacation"; // セラピストの状態 (therapist_profiles.status, オプショナル)
  }