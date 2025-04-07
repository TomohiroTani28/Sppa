// src/types/post.ts
export interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    profilePicture: string;
    role: "tourist" | "therapist";
  };
  media?: {
    url: string;
    mediaType: "image" | "video";
  };
  likes: Array<{
    id: string;
    userId: string;
    postId: string;
    createdAt: string;
  }>;
  comments: Array<{
    id: string;
    content: string;
    userId: string;
    postId: string;
    createdAt: string;
  }>;
}