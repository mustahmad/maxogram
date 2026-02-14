"use client";

import { motion } from "framer-motion";
import { cn, timeAgo, truncate } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import type { Conversation } from "@/types";

interface ConversationItemProps {
  /** The conversation data to display */
  conversation: Conversation;
  /** Whether this conversation is currently selected */
  isActive?: boolean;
  /** Callback when this conversation is clicked */
  onClick?: () => void;
}

export default function ConversationItem({
  conversation,
  isActive = false,
  onClick,
}: ConversationItemProps) {
  // Get the other participant (first participant that is not "self")
  const otherParticipant = conversation.participants[0];

  if (!otherParticipant) return null;

  const lastMessagePreview = conversation.lastMessage
    ? truncate(conversation.lastMessage.content, 40)
    : "No messages yet";

  const timestamp = conversation.lastMessage
    ? timeAgo(conversation.lastMessage.createdAt)
    : timeAgo(conversation.updatedAt);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent",
        isActive ? "bg-muted" : "bg-transparent hover:bg-muted/50",
      )}
    >
      {/* Avatar */}
      <Avatar
        src={otherParticipant.avatarUrl}
        alt={otherParticipant.displayName}
        size="md"
      />

      {/* Name + Last message */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm text-foreground",
              conversation.unreadCount > 0 ? "font-bold" : "font-semibold",
            )}
          >
            {otherParticipant.displayName}
          </p>
          <span
            className={cn(
              "shrink-0 text-xs",
              conversation.unreadCount > 0
                ? "font-semibold text-accent"
                : "text-muted-foreground",
            )}
          >
            {timestamp}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm",
              conversation.unreadCount > 0
                ? "font-medium text-foreground"
                : "text-muted-foreground",
            )}
          >
            {lastMessagePreview}
          </p>

          {/* Unread indicator */}
          {conversation.unreadCount > 0 && (
            <span
              className="inline-flex h-2 w-2 shrink-0 rounded-full bg-accent"
              role="status"
              aria-label={`${conversation.unreadCount} unread messages`}
            />
          )}
        </div>
      </div>
    </motion.button>
  );
}
