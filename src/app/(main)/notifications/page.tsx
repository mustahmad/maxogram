"use client";

import { useEffect } from "react";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/stores/useNotificationStore";
import NotificationList from "@/components/notifications/NotificationList";
import Skeleton from "@/components/ui/Skeleton";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAllRead,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="mx-auto max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium",
              "text-accent transition-colors duration-150",
              "hover:bg-accent/10",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            )}
          >
            <CheckCheck size={16} aria-hidden="true" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading && notifications.length === 0 ? (
        <div className="flex flex-col">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton variant="circle" className="h-8 w-8" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="h-4 w-56" />
                <Skeleton variant="text" className="h-3 w-16" />
              </div>
              {i % 3 === 0 && (
                <Skeleton variant="rect" className="h-10 w-10 rounded-md" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <NotificationList notifications={notifications} />
      )}
    </div>
  );
}
