import { User } from "./user";

export interface Story {
  id: string;
  authorId: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  duration: number;
  viewersCount: number;
  isViewed: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface StoryGroup {
  user: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  stories: Story[];
  hasUnviewed: boolean;
}
