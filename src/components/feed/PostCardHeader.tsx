"use client";

import { MoreHorizontal, BadgeCheck } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import TimeAgo from "@/components/shared/TimeAgo";
import { cn } from "@/lib/utils";

interface PostCardHeaderProps {
  author: {
    username: string;
    displayName: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  createdAt: string;
  onMenuClick: () => void;
}

export default function PostCardHeader({
  author,
  createdAt,
  onMenuClick,
}: PostCardHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Avatar src={author.avatarUrl} alt={author.displayName} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="truncate text-sm font-semibold text-foreground">
            {author.username}
          </span>
          {author.isVerified && (
            <BadgeCheck
              size={14}
              className="shrink-0 fill-blue-500 text-white"
              aria-label="Verified"
            />
          )}
          <span className="text-muted-foreground" aria-hidden="true">
            &middot;
          </span>
          <TimeAgo date={createdAt} />
        </div>
      </div>
      <button
        type="button"
        onClick={onMenuClick}
        className={cn(
          "shrink-0 rounded-full p-1.5 transition-colors",
          "text-foreground hover:bg-muted",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        )}
        aria-label="More options"
      >
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
}
