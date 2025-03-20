// src/types/post.ts
export interface Post {
  id: string;
  userId: string;
  content?: string;
  postType: 'service' | 'review' | 'question' | 'general';
  location?: string;
  createdAt: string;
  media?: {
    url: string;
    mediaType: 'photo' | 'video';
  };
  user: {
    id: string;
    name: string;
    profilePicture?: string;
    role: 'therapist' | 'tourist';
  };
}