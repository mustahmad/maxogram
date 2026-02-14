"use client";

import Avatar from "@/components/ui/Avatar";
import { cn, truncate } from "@/lib/utils";
import type { User } from "@/types";

interface StoryBubbleProps {
  user: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  hasUnviewed: boolean;
  onClick: () => void;
}

export default function StoryBubble({
  user,
  hasUnviewed,
  onClick,
}: StoryBubbleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      )}
      aria-label={`View ${user.username}'s story`}
    >
      <Avatar
        src={user.avatarUrl}
        alt={user.displayName}
        size="lg"
        hasStory={hasUnviewed}
        storyViewed={!hasUnviewed}
        onClick={onClick}
      />
      <span className="w-16 truncate text-center text-xs text-foreground">
        {truncate(user.username, 10)}
      </span>
    </button>
  );
}
