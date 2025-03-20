// src/types/activity-log.ts
export interface ActivityLog {
    id: string;  // UUID
    user_id: string;  // ユーザーID (観光客またはセラピスト)
    activity_type: string;  // アクティビティタイプ（例：予約、レビュー、いいね）
    description: string;  // アクティビティの詳細
    created_at: string;  // アクティビティが発生した日時 (ISO 8601形式)
  }
  