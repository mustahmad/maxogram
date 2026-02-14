import { User } from "./user";

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  content: string;
  likesCount: number;
  isLiked: boolean;
  parentId?: string;
  createdAt: string;
}
