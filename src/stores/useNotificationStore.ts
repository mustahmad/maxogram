import { create } from "zustand";
import type { Notification } from "@/types";
import { mockNotifications } from "@/data/notifications";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  (set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
      set({ isLoading: true });
      await new Promise((r) => setTimeout(r, 300));

      const items = [...mockNotifications];
      const unread = items.filter((n) => !n.isRead).length;

      set({
        notifications: items,
        unreadCount: unread,
        isLoading: false,
      });
    },

    markAllRead: async () => {
      set({
        notifications: get().notifications.map((n) => ({
          ...n,
          isRead: true,
        })),
        unreadCount: 0,
      });
    },
  })
);
