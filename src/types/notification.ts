import { User } from "./user";

export type NotificationType = "like" | "comment" | "follow" | "mention" | "story_reaction";

export interface Notification {
  id: string;
  type: NotificationType;
  actorId: string;
  actor: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  targetId?: string;
  targetThumbnail?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
