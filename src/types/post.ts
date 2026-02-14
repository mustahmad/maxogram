import { User } from "./user";

export type PostType = "photo" | "video" | "carousel" | "text";

export interface PostMedia {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  duration?: number;
}

export interface Post {
  id: string;
  authorId: string;
  author: Pick<User, "id" | "username" | "displayName" | "avatarUrl" | "isVerified">;
  type: PostType;
  media: PostMedia[];
  caption: string;
  tags: string[];
  location?: string;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  engagementScore: number;
  viewCount: number;
}
