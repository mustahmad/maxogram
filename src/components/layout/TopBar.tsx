"use client";

import Link from "next/link";
import { Heart, Send } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import Badge from "@/components/ui/Badge";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useMessageStore } from "@/stores/useMessageStore";

export default function TopBar() {
  const unreadNotifications = useNotificationStore((s) => s.unreadCount);
  const conversations = useMessageStore((s) => s.conversations);

  const unreadMessages = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-lg safe-top">
      <div className="flex h-14 items-center justify-between px-4">
      {/* Logo */}
      <Link href="/feed" className="text-brand-gradient text-xl font-bold">
        Maxogram
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Link href="/notifications" className="relative">
          <IconButton aria-label="Notifications">
            <Heart size={22} />
          </IconButton>
          {unreadNotifications > 0 && (
            <Badge
              count={unreadNotifications}
              className="absolute -right-0.5 -top-0.5"
            />
          )}
        </Link>

        <Link href="/messages" className="relative">
          <IconButton aria-label="Messages">
            <Send size={22} />
          </IconButton>
          {unreadMessages > 0 && (
            <Badge
              count={unreadMessages}
              className="absolute -right-0.5 -top-0.5"
            />
          )}
        </Link>
      </div>
      </div>
    </header>
  );
}
