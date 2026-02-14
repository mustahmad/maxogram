import { create } from "zustand";
import type { Conversation, Message } from "@/types";

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
    try {
      const res = await fetch("/api/messages");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const data = await res.json();
      set({ conversations: data.data ?? data.conversations ?? [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/messages/${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      set({ messages: data.data ?? data.messages ?? [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  sendMessage: async (conversationId: string, content: string) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      conversationId,
      content,
      senderId: "current-user",
      type: "text",
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    set((state) => ({
      messages: [...state.messages, optimisticMessage],
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, lastMessage: optimisticMessage, updatedAt: new Date().toISOString() }
          : conv
      ),
    }));

    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      const serverMessage = data.data ?? data.message;

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === tempId ? serverMessage : msg
        ),
      }));
    } catch {
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== tempId),
      }));
    }
  },

  setActiveConversation: (id: string) => {
    set({ activeConversation: id, messages: [] });
    get().fetchMessages(id);
  },
}));
