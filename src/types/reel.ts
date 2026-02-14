import { User } from "./user";

export interface Reel {
  id: string;
  authorId: string;
  author: Pick<User, "id" | "username" | "displayName" | "avatarUrl" | "isVerified">;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  tags: string[];
  audioName: string;
  audioId: string;
  duration: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  engagementScore: number;
}
