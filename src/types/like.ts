export interface Like {
    id: string;
    guest_id: string;
    therapist_id: string;
    is_matched: boolean;
    matched_at: string | null;
    created_at: string;
  }
  