import { User } from "./user";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "post_share";
  sharedPostId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: Pick<User, "id" | "username" | "displayName" | "avatarUrl">[];
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string;
}
