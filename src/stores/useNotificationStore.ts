import { create } from "zustand";
import type { Notification } from "@/types";

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
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) throw new Error("Failed to fetch notifications");

        const json = await res.json();
        const items: Notification[] = json.data ?? [];
        const unread = items.filter((n) => !n.isRead).length;

        set({
          notifications: items,
          unreadCount: unread,
          isLoading: false,
        });
      } catch {
        set({ isLoading: false });
      }
    },

    markAllRead: async () => {
      const prevNotifications = get().notifications;
      const prevUnreadCount = get().unreadCount;

      set({
        notifications: get().notifications.map((n) => ({
          ...n,
          isRead: true,
        })),
        unreadCount: 0,
      });

      try {
        const res = await fetch("/api/notifications/read", {
          method: "POST",
        });
        if (!res.ok) throw new Error("Failed to mark notifications as read");
      } catch {
        set({
          notifications: prevNotifications,
          unreadCount: prevUnreadCount,
        });
      }
    },
  })
);
