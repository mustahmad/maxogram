"use client";

import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { cn, timeAgo } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import type { Notification, NotificationType } from "@/types";

const typeIcons: Record<NotificationType, typeof Heart> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: AtSign,
  story_reaction: Sparkles,
};

const typeIconColors: Record<NotificationType, string> = {
  like: "text-red-500",
  comment: "text-blue-500",
  follow: "text-accent",
  mention: "text-amber-500",
  story_reaction: "text-purple-500",
};

interface NotificationItemProps {
  /** The notification data to display */
  notification: Notification;
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const Icon = typeIcons[notification.type];
  const iconColor = typeIconColors[notification.type];

  // Parse the message to bold the actor username
  const renderMessage = () => {
    const parts = notification.message.split(notification.actor.username);
    if (parts.length < 2) {
      return <span className="text-sm text-foreground">{notification.message}</span>;
    }

    return (
      <span className="text-sm text-foreground">
        <span className="font-bold">{notification.actor.username}</span>
        {parts.slice(1).join(notification.actor.username)}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors duration-150",
        notification.isRead ? "bg-transparent" : "bg-accent/5",
      )}
    >
      {/* Type icon overlaid on avatar */}
      <div className="relative shrink-0">
        <Avatar
          src={notification.actor.avatarUrl}
          alt={notification.actor.displayName}
          size="sm"
        />
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-background",
            iconColor,
          )}
          aria-hidden="true"
        >
          <Icon size={12} fill="currentColor" />
        </span>
      </div>

      {/* Message text + time */}
      <div className="min-w-0 flex-1">
        <p className="leading-snug">
          {renderMessage()}
        </p>
        <span className="text-xs text-muted-foreground">
          {timeAgo(notification.createdAt)}
        </span>
      </div>

      {/* Right side: thumbnail or follow button */}
      {notification.targetThumbnail ? (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
          <Image
            src={notification.targetThumbnail}
            alt="Post thumbnail"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
      ) : notification.type === "follow" ? (
        <Button variant="primary" size="sm">
          Follow
        </Button>
      ) : null}
    </motion.div>
  );
}
