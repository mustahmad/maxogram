"use client";

import { useMemo } from "react";
import { Bell } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import NotificationItem from "./NotificationItem";
import type { Notification } from "@/types";

interface NotificationListProps {
  /** Notifications to display */
  notifications: Notification[];
}

/** Categorize a date string into Today, This Week, or Earlier */
function categorizeDate(dateString: string): "Today" | "This Week" | "Earlier" {
  const now = new Date();
  const date = new Date(dateString);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (date >= startOfToday) return "Today";

  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - dayOfWeek);

  if (date >= startOfWeek) return "This Week";

  return "Earlier";
}

interface GroupedNotifications {
  label: string;
  items: Notification[];
}

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  const grouped = useMemo<GroupedNotifications[]>(() => {
    const sections: Record<string, Notification[]> = {
      Today: [],
      "This Week": [],
      Earlier: [],
    };

    for (const notif of notifications) {
      const category = categorizeDate(notif.createdAt);
      sections[category].push(notif);
    }

    // Only include non-empty sections, preserving order
    return (["Today", "This Week", "Earlier"] as const)
      .filter((label) => sections[label].length > 0)
      .map((label) => ({ label, items: sections[label] }));
  }, [notifications]);

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No notifications yet"
        description="When someone interacts with your content, you'll see it here."
      />
    );
  }

  return (
    <div className="flex flex-col">
      {grouped.map((group) => (
        <section key={group.label}>
          <h2 className="px-4 pb-1 pt-4 text-sm font-bold text-foreground">
            {group.label}
          </h2>
          {group.items.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
