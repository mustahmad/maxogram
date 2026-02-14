import { create } from "zustand";
import type { Conversation, Message } from "@/types";
import { mockConversations, getMessagesByConversation } from "@/data/messages";

interface MessageState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Message[];
  isLoading: boolean;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  setActiveConversation: (id: string) => void;
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 300));
    set({ conversations: [...mockConversations], isLoading: false });
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 300));
    const msgs = getMessagesByConversation(conversationId);
    set({ messages: msgs, isLoading: false });
  },

  sendMessage: async (conversationId: string, content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      content,
      senderId: "current-user",
      type: "text",
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, lastMessage: newMessage, updatedAt: new Date().toISOString() }
          : conv
      ),
    }));
  },

  setActiveConversation: (id: string) => {
    set({ activeConversation: id, messages: [] });
    get().fetchMessages(id);
  },
}));
